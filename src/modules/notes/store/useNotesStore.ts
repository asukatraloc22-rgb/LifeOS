import { create } from 'zustand';
import { kernel } from '@/core/kernel/Kernel';
import { Repository } from '@/core/storage/Repository';
import type { Note } from '../types';

const repo = new Repository<Note>(kernel.storage, 'notes.items');

interface NotesState {
  notes: Note[];
  loaded: boolean;
  load: () => Promise<void>;
  addNote: (title: string, body: string) => Promise<Note>;
  updateNote: (id: number, title: string, body: string) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  loaded: false,

  load: async () => {
    const notes = await repo.getAll();
    set({ notes: notes.sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? '')), loaded: true });
  },

  addNote: async (title, body) => {
    const note: Note = { id: Date.now(), title, body, updatedAt: new Date().toISOString() };
    await repo.add(note);
    set({ notes: [note, ...get().notes] });
    return note;
  },

  updateNote: async (id, title, body) => {
    const updated = await repo.update(
      (n) => n.id === id,
      (n) => ({ ...n, title, body, updatedAt: new Date().toISOString() }),
    );
    set({ notes: updated.sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? '')) });
  },

  deleteNote: async (id) => {
    const updated = await repo.remove((n) => n.id === id);
    set({ notes: updated });
  },
}));
