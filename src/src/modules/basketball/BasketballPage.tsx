import { useEffect, useState } from 'react';
import { PageHeader } from '@/shared/layouts/PageHeader';
import { useBasketballStore } from './store/useBasketballStore';
import { SessionTracker } from './components/SessionTracker';
import { SessionHistory } from './components/SessionHistory';
import { WeightTracker } from './components/WeightTracker';
import { InjuryJournal } from './components/InjuryJournal';
import { cn } from '@/shared/utils/cn';

const TABS = [
  { id: 'tracker', label: 'Séance du jour' },
  { id: 'history', label: 'Historique' },
  { id: 'weight', label: 'Poids' },
  { id: 'injuries', label: 'Blessures' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function BasketballPage() {
  const load = useBasketballStore((s) => s.load);
  const loaded = useBasketballStore((s) => s.loaded);
  const [tab, setTab] = useState<TabId>('tracker');

  useEffect(() => {
    load();
  }, [load]);

  if (!loaded) return null;

  return (
    <div>
      <PageHeader title="AthleteOS 🏀" subtitle="Programme, tracker de séance, poids et suivi des blessures" />

      <div className="flex gap-1 mb-5 bg-bg-3 p-1 rounded-lg border border-border w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors',
              tab === t.id ? 'bg-bg text-text shadow' : 'text-text-2 hover:text-text',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'tracker' && <SessionTracker />}
      {tab === 'history' && <SessionHistory />}
      {tab === 'weight' && <WeightTracker />}
      {tab === 'injuries' && <InjuryJournal />}
    </div>
  );
}
