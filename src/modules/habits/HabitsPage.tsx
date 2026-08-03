import { useEffect, useState } from 'react';
import { PageHeader } from '@/shared/layouts/PageHeader';
import { Card, Button, Badge, ProgressBar } from '@/shared/components/ui';
import { useHabitsStore } from './store/useHabitsStore';

export function HabitsPage() {
  const { habits, loaded, load, addHabit, toggleHabit, deleteHabit } = useHabitsStore();
  const [name, setName] = useState('');

  useEffect(() => {
    load();
  }, [load]);

  if (!loaded) return null;

  const doneCount = habits.filter((h) => h.doneToday).length;
  const pct = habits.length ? (doneCount / habits.length) * 100 : 0;

  function submit() {
    if (!name.trim()) return;
    addHabit(name.trim());
    setName('');
  }

  return (
    <div>
      <PageHeader title="Habitudes 🔁" subtitle="Ta discipline, jour après jour" />

      {habits.length > 0 && (
        <Card className="mb-4">
          <div className="flex justify-between text-xs mb-2">
            <span>Aujourd'hui</span>
            <span className="text-text-2">{doneCount}/{habits.length}</span>
          </div>
          <ProgressBar value={pct} tone="success" />
        </Card>
      )}

      <Card className="mb-4">
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Nouvelle habitude (ex: Lire 20 min, Méditer...)"
            className="flex-1 bg-bg-3 border border-border-2 rounded-md px-3 py-2 text-xs"
          />
          <Button onClick={submit}>Ajouter</Button>
        </div>
      </Card>

      {habits.length === 0 ? (
        <p className="text-xs text-text-3 italic text-center py-8">Aucune habitude pour l'instant.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {habits.map((h) => (
            <Card
              key={h.id}
              hoverable
              onClick={() => toggleHabit(h.id)}
              className={h.doneToday ? 'border-success/40 bg-success/5' : undefined}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] ${
                      h.doneToday ? 'bg-success border-success text-white' : 'border-border-2'
                    }`}
                  >
                    {h.doneToday && '✓'}
                  </div>
                  <span className="text-xs font-medium">{h.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHabit(h.id);
                  }}
                  className="text-danger text-[11px] hover:opacity-75"
                >
                  ✕
                </button>
              </div>
              {h.streak > 0 && (
                <div className="mt-2">
                  <Badge tone="warning">🔥 {h.streak} jour{h.streak > 1 ? 's' : ''}</Badge>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
