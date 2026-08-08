import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/shared/layouts/PageHeader';
import { Card, Button, Input } from '@/shared/components/ui';
import { useNotesStore } from './store/useNotesStore';
import { NoteEditor } from './components/NoteEditor';
import type { Note } from './types';

function formatDate(iso?: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export function NotesPage() {
  const { notes, loaded, load, addNote, updateNote, deleteNote } = useNotesStore();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Note | null | 'new'>(null);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q));
  }, [notes, query]);

  if (!loaded) return null;

  function handleSave(title: string, body: string) {
    if (!title.trim()) return;
    if (editing === 'new') {
      addNote(title.trim(), body);
    } else if (editing) {
      updateNote(editing.id, title.trim(), body);
    }
    setEditing(null);
  }

  return (
    <div>
      <PageHeader
        title="Notes ✎"
        subtitle="Ta base de connaissance personnelle"
        actions={<Button onClick={() => setEditing('new')}>+ Nouvelle note</Button>}
      />

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher dans tes notes..."
        className="mb-5 max-w-sm"
      />

      {filtered.length === 0 ? (
        <p className="text-xs text-text-3 italic text-center py-12">
          {notes.length === 0 ? 'Aucune note pour le moment.' : 'Aucun résultat.'}
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {filtered.map((n) => (
            <Card key={n.id} hoverable onClick={() => setEditing(n)} className="flex flex-col h-36">
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-semibold line-clamp-1">{n.title}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(n.id);
                  }}
                  className="text-danger text-[11px] hover:opacity-75 shrink-0 ml-2"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] text-text-2 mt-1.5 line-clamp-4 whitespace-pre-wrap flex-1">{n.body}</p>
              {n.updatedAt && <div className="text-[9px] text-text-3 mt-2">{formatDate(n.updatedAt)}</div>}
            </Card>
          ))}
        </div>
      )}

      <NoteEditor
        open={editing !== null}
        note={editing === 'new' ? null : editing}
        onClose={() => setEditing(null)}
        onSave={handleSave}
      />
    </div>
  );
}
