import { useBasketballStore } from '../store/useBasketballStore';
import { Card } from '@/shared/components/ui';

export function SessionHistory() {
  const sessions = useBasketballStore((s) => s.sessions);
  const deleteSession = useBasketballStore((s) => s.deleteSession);

  if (sessions.length === 0) {
    return <p className="text-xs text-text-3 italic py-6 text-center">Aucune séance enregistrée pour le moment.</p>;
  }

  return (
    <div className="space-y-2">
      {sessions.slice(0, 30).map((entry) => {
        const done = entry.exercises.filter((e) => e.done).length;
        const pct = entry.shootAtt ? Math.round(((entry.shootMade ?? 0) / entry.shootAtt) * 100) : null;
        return (
          <Card key={entry.id} padding="sm" className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs text-accent-2 font-semibold">{entry.date} — {entry.dayLabel} ({entry.title})</div>
              <div className="text-[11px] text-text-2 mt-1">
                Fatigue {entry.fatigue}/5 · {entry.mobilite ? 'Mobilité faite' : 'Mobilité non faite'}
                {entry.plyo !== null && <> · {entry.plyo ? 'Saut/plyo fait' : 'Saut/plyo non fait'}</>}
                {entry.technique !== null && <> · {entry.technique ? 'Technique faite' : 'Technique non faite'}</>}
                {pct !== null && <> · Tir {entry.shootMade}/{entry.shootAtt} ({pct}%)</>}
                {entry.exercises.length > 0 && <> · {done}/{entry.exercises.length} exercices faits</>}
              </div>
              {entry.note && <div className="text-[11px] text-text-3 italic mt-1">{entry.note}</div>}
            </div>
            <button onClick={() => deleteSession(entry.id)} className="text-[11px] text-danger hover:opacity-75 shrink-0">
              Supprimer
            </button>
          </Card>
        );
      })}
    </div>
  );
}
