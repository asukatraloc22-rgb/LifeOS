import { useEffect, useState } from 'react';
import { Modal, Field, Input } from '@/shared/components/ui';
import type { Note } from '../types';

interface Props {
  open: boolean;
  note: Note | null;
  onClose: () => void;
  onSave: (title: string, body: string) => void;
}

export function NoteEditor({ open, note, onClose, onSave }: Props) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    setTitle(note?.title ?? '');
    setBody(note?.body ?? '');
  }, [note, open]);

  return (
    <Modal open={open} title={note ? 'Modifier la note' : 'Nouvelle note'} onClose={onClose} onConfirm={() => onSave(title, body)}>
      <Field label="Titre">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre de la note" autoFocus />
      </Field>
      <Field label="Contenu">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Écris ici..."
          className="w-full bg-bg-3 border border-border-2 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent resize-none h-40"
        />
      </Field>
    </Modal>
  );
}
