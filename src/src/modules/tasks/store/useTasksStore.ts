import { create } from 'zustand';
import { kernel } from '@/core/kernel/Kernel';
import { Repository } from '@/core/storage/Repository';
import type { Task, TaskStatus } from '../types';

const repo = new Repository<Task>(kernel.storage, 'tasks.items');
const ORDER: TaskStatus[] = ['todo', 'inprogress', 'done'];

interface TasksState {
  tasks: Task[];
  loaded: boolean;
  load: () => Promise<void>;
  addTask: (desc: string, project: string) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  cycleStatus: (id: number, direction: 'next' | 'prev') => Promise<void>;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  loaded: false,

  load: async () => {
    const tasks = await repo.getAll();
    set({ tasks, loaded: true });
  },

  addTask: async (desc, project) => {
    const task: Task = { id: Date.now(), desc, project: project || 'Général', status: 'todo' };
    await repo.add(task);
    set({ tasks: [...get().tasks, task] });
  },

  deleteTask: async (id) => {
    const updated = await repo.remove((t) => t.id === id);
    set({ tasks: updated });
  },

  cycleStatus: async (id, direction) => {
    const updated = await repo.update(
      (t) => t.id === id,
      (t) => {
        const idx = ORDER.indexOf(t.status);
        const nextIdx = direction === 'next' ? Math.min(idx + 1, 2) : Math.max(idx - 1, 0);
        return { ...t, status: ORDER[nextIdx] };
      },
    );
    set({ tasks: updated });
  },
}));
