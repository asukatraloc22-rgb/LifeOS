import { useState } from 'react';
import { INJURY_TYPES } from '../data/program';
import { useBasketballStore } from '../store/useBasketballStore';
import { Card, Button, Badge } from '@/shared/components/ui';
import type { InjuryStatus } from '../types';

export function InjuryJournal() {
  const injuries = useBasketballStore((s) => s.injuries);
  const addInjury = useBasketballStore((s) => s.addInjury);
  const deleteInjury = useBasketballStore((s) => s.deleteInjury);

  const [openId, setOpenId] = useState<string | null>(null);
  const [type, setType] = useState(INJURY_TYPES[0].name);
  const [pain, setPain] = useState('');
  const [status, setStatus] = useState<InjuryStatus>('Active');
  const [note, setNote] = useState('');

  function submit() {
    addInjury({ date: new Date().toISOString().slice(0, 10), type, pain: Number(pain) || 0, status, note });
    setNote('');
    setPain('');
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {INJURY_TYPES.map((t) => (
          <Card
            key={t.id}
            hoverable
            padding="sm"
            className={openId === t.id ? 'border-danger/50' : undefined}
            onClick={() => setOpenId(openId === t.id ? null : t.id)}
          >
            <h4 className="text-xs font-semibold text-text">{t.name}</h4>
            <p className="text-[11px] text-text-3 mt-1">{t.short}</p>
          </Card>
        ))}
      </div>

      {openId && (
        <Card className="border-l-4 border-l-danger">
          {(() => {
            const t = INJURY_TYPES.find((i) => i.id === openId)!;
            return (
              <div className="space-y-2 text-xs text-text-2">
                <p><strong className="text-text">Signes courants :</strong> {t.signs}</p>
                <p><strong className="text-text">Prise en charge générale :</strong> {t.care}</p>
                <p><strong className="text-text">À éviter :</strong> {t.avoid}</p>
              </div>
            );
          })()}
        </Card>
      )}

      <Card>
        <h3 className="font-display font-bold text-sm mb-3">Nouvelle entrée</h3>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-[10px] uppercase text-text-3 mb-1">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="bg-bg-3 border border-border-2 rounded-md px-2 py-1.5 text-xs w-full">
              {INJURY_TYPES.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase text-text-3 mb-1">Douleur (1-10)</label>
            <input type="number" min={1} max={10} value={pain} onChange={(e) => setPain(e.target.value)} className="bg-bg-3 border border-border-2 rounded-md px-2 py-1.5 text-xs w-full" />
          </div>
          <div>
            <label className="block text-[10px] uppercase text-text-3 mb-1">Statut</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as InjuryStatus)} className="bg-bg-3 border border-border-2 rounded-md px-2 py-1.5 text-xs w-full">
              <option>Active</option>
              <option>En amélioration</option>
              <option>Guérie</option>
            </select>
          </div>
        </div>
        <textarea
          placeholder="Contexte, sensations, ce qui déclenche la douleur..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="bg-bg-3 border border-border-2 rounded-md px-2 py-2 text-xs w-full resize-none h-16 mb-3"
        />
        <Button variant="danger" onClick={submit}>Enregistrer dans le journal</Button>
      </Card>

      <div className="space-y-1.5">
        {injuries.map((entry) => (
          <div key={entry.id} className="flex items-start justify-between bg-bg-3 border border-border rounded-lg px-3 py-2 text-xs">
            <div>
              <div className="text-text font-medium">{entry.date} — {entry.type}</div>
              <div className="text-text-3 mt-0.5 flex items-center gap-1.5">
                <Badge tone={entry.status === 'Active' ? 'danger' : entry.status === 'Guérie' ? 'success' : 'warning'}>{entry.status}</Badge>
                {entry.pain > 0 && <span>Douleur {entry.pain}/10</span>}
              </div>
              {entry.note && <div className="text-text-3 italic mt-1">{entry.note}</div>}
            </div>
            <button onClick={() => deleteInjury(entry.id)} className="text-danger hover:opacity-75 shrink-0">Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
}
