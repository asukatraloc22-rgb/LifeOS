import { create } from 'zustand';
import { kernel } from '@/core/kernel/Kernel';
import { Repository } from '@/core/storage/Repository';
import { LocalStorageAdapter } from '@/core/storage/StorageAdapter';
import { SupabaseStorageAdapter } from '@/core/storage/SupabaseStorageAdapter';
import { supabase, isSupabaseConfigured } from '@/core/storage/SupabaseClient';
import { hashPin, verifyPin } from './crypto';
import { migrateLocalToSupabase } from './migrateToSupabase';

interface Credential {
  salt: string;
  hash: string;
}

const repo = new Repository<Credential>(kernel.storage, 'auth.credential');
const SESSION_KEY = 'lifeos.v2.session.unlocked';

interface AuthState {
  mode: 'local' | 'supabase';
  ready: boolean;
  hasCredential: boolean;
  unlocked: boolean;
  userEmail: string | null;
  authError: string | null;
  init: () => Promise<void>;
  setPin: (pin: string) => Promise<void>;
  unlock: (pin: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  lock: () => void;
}

async function activateSupabaseSession(userId: string) {
  kernel.storage.setActive(new SupabaseStorageAdapter());
  await migrateLocalToSupabase(userId);
}

function activateLocalSession() {
  kernel.storage.setActive(new LocalStorageAdapter());
}

export const useAuthStore = create<AuthState>((set, get) => ({
  mode: isSupabaseConfigured ? 'supabase' : 'local',
  ready: false,
  hasCredential: false,
  unlocked: false,
  userEmail: null,
  authError: null,

  init: async () => {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (session) {
        await activateSupabaseSession(session.user.id);
      }
      set({ ready: true, unlocked: !!session, userEmail: session?.user.email ?? null });

      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session) {
          await activateSupabaseSession(session.user.id);
          set({ unlocked: true, userEmail: session.user.email ?? null });
        } else {
          activateLocalSession();
          set({ unlocked: false, userEmail: null });
        }
      });
      return;
    }

    const cred = await repo.getValue<Credential | null>(null);
    const sessionUnlocked = sessionStorage.getItem(SESSION_KEY) === 'true';
    set({
      ready: true,
      hasCredential: !!cred,
      unlocked: !cred || sessionUnlocked,
    });
  },

  setPin: async (pin: string) => {
    const cred = await hashPin(pin);
    await repo.setValue(cred);
    sessionStorage.setItem(SESSION_KEY, 'true');
    set({ hasCredential: true, unlocked: true });
  },

  unlock: async (pin: string) => {
    const cred = await repo.getValue<Credential | null>(null);
    if (!cred) return true;
    const ok = await verifyPin(pin, cred.salt, cred.hash);
    if (ok) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      set({ unlocked: true });
    }
    return ok;
  },

  signIn: async (email, password) => {
    if (!supabase) return;
    set({ authError: null });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) set({ authError: error.message });
  },

  signUp: async (email, password) => {
    if (!supabase) return;
    set({ authError: null });
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      set({ authError: error.message });
    } else {
      set({ authError: 'Compte créé. Vérifie ta boîte mail pour confirmer, puis connecte-toi.' });
    }
  },

  lock: () => {
    if (get().mode === 'supabase' && supabase) {
      supabase.auth.signOut();
      return;
    }
    sessionStorage.removeItem(SESSION_KEY);
    set({ unlocked: false });
  },
}));
