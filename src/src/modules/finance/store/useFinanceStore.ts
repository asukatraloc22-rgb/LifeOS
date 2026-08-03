import { create } from 'zustand';
import { kernel } from '@/core/kernel/Kernel';
import { Repository } from '@/core/storage/Repository';
import type { Transaction, FinancialGoal } from '../types';

const txRepo = new Repository<Transaction>(kernel.storage, 'finance.transactions');
const goalsRepo = new Repository<FinancialGoal>(kernel.storage, 'goals.items');

interface FinanceState {
  transactions: Transaction[];
  goals: FinancialGoal[];
  loaded: boolean;
  load: () => Promise<void>;
  addTransaction: (t: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  addGoal: (g: Omit<FinancialGoal, 'id'>) => Promise<void>;
  contributeToGoal: (id: number, amount: number) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: [],
  goals: [],
  loaded: false,

  load: async () => {
    const [transactions, goals] = await Promise.all([txRepo.getAll(), goalsRepo.getAll()]);
    set({
      transactions: transactions.sort((a, b) => b.date.localeCompare(a.date)),
      goals,
      loaded: true,
    });
  },

  addTransaction: async (t) => {
    const full = { ...t, id: Date.now() };
    await txRepo.add(full);
    set({ transactions: [full, ...get().transactions] });
  },

  deleteTransaction: async (id) => {
    await txRepo.remove((t) => t.id === id);
    set({ transactions: get().transactions.filter((t) => t.id !== id) });
  },

  addGoal: async (g) => {
    const full = { ...g, id: Date.now() };
    await goalsRepo.add(full);
    set({ goals: [...get().goals, full] });
  },

  contributeToGoal: async (id, amount) => {
    const updated = await goalsRepo.update(
      (g) => g.id === id,
      (g) => ({ ...g, current: g.current + amount }),
    );
    set({ goals: updated });

    const goal = updated.find((g) => g.id === id);
    if (goal) {
      await get().addTransaction({
        type: 'depense',
        desc: `Épargne : ${goal.name}`,
        montant: amount,
        cat: 'Épargne',
        date: new Date().toISOString().slice(0, 10),
      });
    }
  },
}));
