import { useEffect, useMemo } from 'react';
import { PageHeader } from '@/shared/layouts/PageHeader';
import { Card, StatCard, ProgressBar, Badge } from '@/shared/components/ui';
import { useFinanceStore } from '../finance/store/useFinanceStore';
import { useBasketballStore } from '../basketball/store/useBasketballStore';
import { useHabitsStore } from '../habits/store/useHabitsStore';
import { Link } from 'react-router-dom';

function fmt(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' Ar';
}

export function DashboardPage() {
  const loadFinance = useFinanceStore((s) => s.load);
  const financeLoaded = useFinanceStore((s) => s.loaded);
  const transactions = useFinanceStore((s) => s.transactions);
  const goals = useFinanceStore((s) => s.goals);

  const loadBasketball = useBasketballStore((s) => s.load);
  const basketballLoaded = useBasketballStore((s) => s.loaded);
  const sessions = useBasketballStore((s) => s.sessions);
  const weights = useBasketballStore((s) => s.weights);

  const loadHabits = useHabitsStore((s) => s.load);
  const habitsLoaded = useHabitsStore((s) => s.loaded);
  const habits = useHabitsStore((s) => s.habits);
  const toggleHabit = useHabitsStore((s) => s.toggleHabit);

  useEffect(() => {
    loadFinance();
    loadBasketball();
    loadHabits();
  }, [loadFinance, loadBasketball, loadHabits]);

  const { balance, weekExpense } = useMemo(() => {
    let inc = 0, exp = 0, weekExp = 0;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    for (const t of transactions) {
      if (t.type === 'revenu') inc += t.montant;
      else {
        exp += t.montant;
        if (new Date(t.date) >= weekAgo) weekExp += t.montant;
      }
    }
    return { balance: inc - exp, weekExpense: weekExp };
  }, [transactions]);

  const sessionsThisWeek = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessions.filter((s) => new Date(s.date) >= weekAgo).length;
  }, [sessions]);

  const currentWeight = weights[weights.length - 1]?.value;

  if (!financeLoaded || !basketballLoaded || !habitsLoaded) return null;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Ton centre de contrôle — LifeOS" />

      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard label="Solde" value={fmt(balance)} />
        <StatCard label="Dépenses (7j)" value={fmt(weekExpense)} change={{ value: '', direction: weekExpense > 0 ? 'down' : 'neutral' }} />
        <StatCard label="Séances basket (7j)" value={sessionsThisWeek} />
        <StatCard label="Poids actuel" value={currentWeight ? `${currentWeight} kg` : '—'} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-sm">Objectifs financiers</h3>
            <Link to="/finance" className="text-[11px] text-accent-2 hover:underline">Voir tout →</Link>
          </div>
          {goals.length === 0 ? (
            <p className="text-xs text-text-3">Aucun objectif défini pour l'instant.</p>
          ) : (
            <div className="space-y-3">
              {goals.slice(0, 4).map((g) => (
                <div key={g.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{g.name}</span>
                    <span className="text-text-2">{fmt(g.current)} / {fmt(g.target)}</span>
                  </div>
                  <ProgressBar value={(g.current / g.target) * 100} tone="success" />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-sm">Dernières séances 🏀</h3>
            <Link to="/basketball" className="text-[11px] text-accent-2 hover:underline">Voir tout →</Link>
          </div>
          {sessions.length === 0 ? (
            <p className="text-xs text-text-3">Aucune séance enregistrée.</p>
          ) : (
            <div className="space-y-2">
              {sessions.slice(0, 4).map((s) => (
                <div key={s.id} className="flex items-center justify-between text-xs">
                  <span className="text-text-2">{s.dayLabel}</span>
                  <Badge tone="accent">{s.date}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-sm">Habitudes du jour 🔁</h3>
            <Link to="/habits" className="text-[11px] text-accent-2 hover:underline">Voir tout →</Link>
          </div>
          {habits.length === 0 ? (
            <p className="text-xs text-text-3">Aucune habitude définie.</p>
          ) : (
            <div className="space-y-2">
              {habits.slice(0, 4).map((h) => (
                <div key={h.id} className="flex items-center justify-between text-xs cursor-pointer" onClick={() => toggleHabit(h.id)}>
                  <span className={h.doneToday ? 'text-text-3 line-through' : 'text-text'}>{h.name}</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] ${h.doneToday ? 'bg-success border-success text-white' : 'border-border-2'}`}>
                    {h.doneToday && '✓'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        {['Immobilier', 'Academy'].map((label) => (
          <Card key={label} className="flex flex-col items-center justify-center py-8 text-center border-dashed">
            <span className="text-[11px] text-text-3">{label} — module à venir</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
