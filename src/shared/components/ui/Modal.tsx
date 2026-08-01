import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  children: ReactNode;
}

export function Modal({ open, title, onClose, onConfirm, confirmLabel = 'Enregistrer', children }: ModalProps) {
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/78 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-bg-2 border border-border-2 rounded-xl p-5 w-[360px] max-h-[88vh] overflow-y-auto">
        <h3 className="font-display text-base font-bold mb-4">{title}</h3>
        <div className="space-y-3">{children}</div>
        <div className="flex gap-2 mt-5">
          <Button variant="secondary" onClick={onClose} className="flex-none px-4">
            Annuler
          </Button>
          {onConfirm && (
            <Button variant="primary" onClick={onConfirm} fullWidth>
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
