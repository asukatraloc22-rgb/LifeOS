import { create } from 'zustand';
import { kernel } from '@/core/kernel/Kernel';
import { Repository } from '@/core/storage/Repository';
import { hashPin, verifyPin } from './crypto';

interface Credential {
  salt: string;
  hash: string;
}

const repo = new Repository<Credential>(kernel.storage, 'auth.credential');
const SESSION_KEY = 'lifeos.v2.session.unlocked';

interface AuthState {
  ready: boolean;
  hasCredential: boolean;
  unlocked: boolean;
  init: () => Promise<void>;
  setPin: (pin: string) => Promise<void>;
  unlock: (pin: string) => Promise<boolean>;
  lock: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  ready: false,
  hasCredential: false,
  unlocked: false,

  init: async () => {
    const cred = await repo.getValue<Credential | null>(null);
    const sessionUnlocked = sessionStorage.getItem(SESSION_KEY) === 'true';
    set({
      ready: true,
      hasCredential: !!cred,
      unlocked: !cred || sessionUnlocked, // no PIN set yet => app is open
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

  lock: () => {
    sessionStorage.removeItem(SESSION_KEY);
    set({ unlocked: false });
  },
}));
