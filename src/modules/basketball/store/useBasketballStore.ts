import { create } from 'zustand';
import { kernel } from '@/core/kernel/Kernel';
import { Repository } from '@/core/storage/Repository';
import type { SessionEntry, WeightEntry, InjuryEntry } from '../types';

const sessionsRepo = new Repository<SessionEntry>(kernel.storage, 'basketball.sessions');
const weightsRepo = new Repository<WeightEntry>(kernel.storage, 'basketball.weights');
const injuriesRepo = new Repository<InjuryEntry>(kernel.storage, 'basketball.injuries');

interface BasketballState {
  sessions: SessionEntry[];
  weights: WeightEntry[];
  injuries: InjuryEntry[];
  loaded: boolean;
  load: () => Promise<void>;
  addSession: (entry: Omit<SessionEntry, 'id'>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  addWeight: (entry: Omit<WeightEntry, 'id'>) => Promise<void>;
  deleteWeight: (id: string) => Promise<void>;
  addInjury: (entry: Omit<InjuryEntry, 'id'>) => Promise<void>;
  deleteInjury: (id: string) => Promise<void>;
}

const uid = () => crypto.randomUUID();

export const useBasketballStore = create<BasketballState>((set, get) => ({
  sessions: [],
  weights: [],
  injuries: [],
  loaded: false,

  load: async () => {
    const [sessions, weights, injuries] = await Promise.all([
      sessionsRepo.getAll(),
      weightsRepo.getAll(),
      injuriesRepo.getAll(),
    ]);
    set({
      sessions: sessions.sort((a, b) => b.date.localeCompare(a.date)),
      weights: weights.sort((a, b) => a.date.localeCompare(b.date)),
      injuries: injuries.sort((a, b) => b.date.localeCompare(a.date)),
      loaded: true,
    });
  },

  addSession: async (entry) => {
    const full = { ...entry, id: uid() };
    await sessionsRepo.add(full);
    set({ sessions: [full, ...get().sessions] });
  },

  deleteSession: async (id) => {
    await sessionsRepo.remove((s) => s.id === id);
    set({ sessions: get().sessions.filter((s) => s.id !== id) });
  },

  addWeight: async (entry) => {
    const full = { ...entry, id: uid() };
    await weightsRepo.add(full);
    set({ weights: [...get().weights, full].sort((a, b) => a.date.localeCompare(b.date)) });
  },

  deleteWeight: async (id) => {
    await weightsRepo.remove((w) => w.id === id);
    set({ weights: get().weights.filter((w) => w.id !== id) });
  },

  addInjury: async (entry) => {
    const full = { ...entry, id: uid() };
    await injuriesRepo.add(full);
    set({ injuries: [full, ...get().injuries] });
  },

  deleteInjury: async (id) => {
    await injuriesRepo.remove((i) => i.id === id);
    set({ injuries: get().injuries.filter((i) => i.id !== id) });
  },
}));
