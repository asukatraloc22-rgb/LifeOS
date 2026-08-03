import { useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Button } from '@/shared/components/ui';
import type { TransactionType } from '../types';

const CATEGORIES = ['Logement', 'Alimentation', 'Transport', 'Loisirs', 'Santé', 'Épargne', 'Salaire', 'Autre'];

export function AddTransactionForm({ type }: { type: TransactionType }) {
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const [desc, setDesc] = useState('');
  const [montant, setMontant] = useState('');
  const [cat, setCat] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  function submit() {
    if (!desc || !montant) return;
    addTransaction({ type, desc, montant: parseInt(montant, 10), cat, date });
    setDesc('');
    setMontant('');
  }

  return (
    <div className="grid grid-cols-2 gap-2 items-end">
      <div className="col-span-2">
        <label className="block text-[10px] uppercase text-text-3 mb-1">Description</label>
        <input value={desc} onChange={(e) => setDesc(e.target.value)} className="bg-bg-3 border border-border-2 rounded-md px-2 py-1.5 text-xs w-full" />
      </div>
      <div>
        <label className="block text-[10px] uppercase text-text-3 mb-1">Montant (Ar)</label>
        <input type="number" value={montant} onChange={(e) => setMontant(e.target.value)} className="bg-bg-3 border border-border-2 rounded-md px-2 py-1.5 text-xs w-full" />
      </div>
      <div>
        <label className="block text-[10px] uppercase text-text-3 mb-1">Catégorie</label>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="bg-bg-3 border border-border-2 rounded-md px-2 py-1.5 text-xs w-full">
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-[10px] uppercase text-text-3 mb-1">Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-bg-3 border border-border-2 rounded-md px-2 py-1.5 text-xs w-full" />
      </div>
      <Button variant={type === 'revenu' ? 'success' : 'danger'} onClick={submit}>
        {type === 'revenu' ? '+ Revenu' : '+ Dépense'}
      </Button>
    </div>
  );
}
