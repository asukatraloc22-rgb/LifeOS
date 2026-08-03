import { create } from 'zustand';
import { kernel } from '@/core/kernel/Kernel';
import { Repository } from '@/core/storage/Repository';
import type { Habit } from '../types';

const repo = new Repository<Habit>(kernel.storage, 'habits.items');

interface HabitsState {
  habits: Habit[];
  loaded: boolean;
  load: () => Promise<void>;
  addHabit: (name: string) => Promise<void>;
  toggleHabit: (id: number) => Promise<void>;
  deleteHabit: (id: number) => Promise<void>;
}

export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: [],
  loaded: false,

  load: async () => {
    const habits = await repo.getAll();
    set({ habits, loaded: true });
  },

  addHabit: async (name) => {
    const habit: Habit = { id: Date.now(), name, doneToday: false, streak: 0 };
    await repo.add(habit);
    set({ habits: [...get().habits, habit] });
  },

  toggleHabit: async (id) => {
    const updated = await repo.update(
      (h) => h.id === id,
      (h) => {
        const doneToday = !h.doneToday;
        const streak = doneToday ? h.streak + 1 : Math.max(0, h.streak - 1);
        return { ...h, doneToday, streak };
      },
    );
    set({ habits: updated });
  },

  deleteHabit: async (id) => {
    const updated = await repo.remove((h) => h.id === id);
    set({ habits: updated });
  },
}));
