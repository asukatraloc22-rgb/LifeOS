import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/shared/layouts/PageHeader';
import { useFinanceStore } from './store/useFinanceStore';
import { StatCard, Card, Badge } from '@/shared/components/ui';
import { AddTransactionForm } from './components/AddTransactionForm';

function fmt(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' Ar';
}

export function FinancePage() {
  const load = useFinanceStore((s) => s.load);
  const loaded = useFinanceStore((s) => s.loaded);
  const transactions = useFinanceStore((s) => s.transactions);
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);
  const [showForm, setShowForm] = useState<'revenu' | 'depense' | null>(null);

  useEffect(() => {
    load();
  }, [load]);

  const { totalIncome, totalExpense, byCategory } = useMemo(() => {
    let inc = 0, exp = 0;
    const cats: Record<string, number> = {};
    for (const t of transactions) {
      if (t.type === 'revenu') inc += t.montant;
      else {
        exp += t.montant;
        cats[t.cat] = (cats[t.cat] ?? 0) + t.montant;
      }
    }
    return { totalIncome: inc, totalExpense: exp, byCategory: cats };
  }, [transactions]);

  if (!loaded) return null;

  return (
    <div>
      <PageHeader
        title="WealthOS 💰"
        subtitle="Vue d'ensemble de vos finances"
      />

      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard label="Revenus" value={fmt(totalIncome)} change={{ value: '', direction: 'up' }} />
        <StatCard label="Dépenses" value={fmt(totalExpense)} change={{ value: '', direction: 'down' }} />
        <StatCard label="Solde" value={fmt(totalIncome - totalExpense)} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <Card>
          <div className="flex gap-1 mb-3">
            <button onClick={() => setShowForm(showForm === 'revenu' ? null : 'revenu')} className="text-xs px-3 py-1.5 rounded-lg bg-success/10 text-success border border-success/25">+ Revenu</button>
            <button onClick={() => setShowForm(showForm === 'depense' ? null : 'depense')} className="text-xs px-3 py-1.5 rounded-lg bg-danger/10 text-danger border border-danger/25">+ Dépense</button>
          </div>
          {showForm && <AddTransactionForm type={showForm} />}
        </Card>

        <Card>
          <div className="text-[10px] uppercase text-text-3 mb-2 font-medium">Par catégorie</div>
          {Object.keys(byCategory).length === 0 ? (
            <p className="text-xs text-text-3">Aucune donnée</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(byCategory).map(([cat, amount]) => (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{cat}</span>
                    <span className="text-text-2">{fmt(amount)}</span>
                  </div>
                  <div className="h-1.5 bg-bg-4 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${(amount / totalExpense) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card padding="none">
        <div className="p-4 pb-0 text-[10px] uppercase text-text-3 font-medium">Transactions récentes</div>
        <div className="p-4">
          {transactions.length === 0 && <p className="text-xs text-text-3">Aucune transaction.</p>}
          {transactions.slice(0, 20).map((t) => (
            <div key={t.id} className="flex items-center justify-between py-2 border-b border-border last:border-0 text-xs">
              <div className="flex items-center gap-2">
                <Badge tone={t.type === 'revenu' ? 'success' : 'danger'}>{t.cat}</Badge>
                <span>{t.desc}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={t.type === 'revenu' ? 'text-success' : 'text-danger'}>
                  {t.type === 'revenu' ? '+' : '-'} {fmt(t.montant)}
                </span>
                <span className="text-text-3">{t.date}</span>
                <button onClick={() => deleteTransaction(t.id)} className="text-danger hover:opacity-75">✕</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
