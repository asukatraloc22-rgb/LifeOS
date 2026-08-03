import { useState } from 'react';
import { useBasketballStore } from '../store/useBasketballStore';
import { Card, Button, StatCard } from '@/shared/components/ui';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function WeightTracker() {
  const weights = useBasketballStore((s) => s.weights);
  const addWeight = useBasketballStore((s) => s.addWeight);
  const deleteWeight = useBasketballStore((s) => s.deleteWeight);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [value, setValue] = useState('');

  function submit() {
    if (!date || !value) return;
    addWeight({ date, value: parseFloat(value) });
    setValue('');
  }

  const first = weights[0]?.value;
  const last = weights[weights.length - 1]?.value;
  const gain = first !== undefined && last !== undefined ? (last - first).toFixed(1) : null;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end flex-wrap">
        <div>
          <label className="block text-[10px] uppercase text-text-3 mb-1">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-bg-3 border border-border-2 rounded-md px-2 py-1.5 text-xs" />
        </div>
        <div>
          <label className="block text-[10px] uppercase text-text-3 mb-1">Poids (kg)</label>
          <input type="number" step="0.1" value={value} onChange={(e) => setValue(e.target.value)} className="bg-bg-3 border border-border-2 rounded-md px-2 py-1.5 text-xs w-28" />
        </div>
        <Button onClick={submit}>Ajouter</Button>
      </div>

      {weights.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Poids actuel" value={`${last} kg`} />
            <StatCard label="Depuis le début" value={`${Number(gain) >= 0 ? '+' : ''}${gain} kg`} change={{ value: '', direction: Number(gain) >= 0 ? 'up' : 'down' }} />
            <StatCard label="Restant pour +8 kg" value={`${(8 - Number(gain)).toFixed(1)} kg`} />
          </div>

          <Card>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weights}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5a5a72' }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#5a5a72' }} />
                <Tooltip contentStyle={{ background: '#1a1a24', border: '1px solid #2a2a38', fontSize: 12 }} />
                <Line type="monotone" dataKey="value" stroke="#6c63ff" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}

      <div className="space-y-1.5">
        {weights.slice().reverse().map((w) => (
          <div key={w.id} className="flex items-center justify-between text-xs bg-bg-3 border border-border rounded-lg px-3 py-2">
            <span className="text-text-2">{w.date}</span>
            <span className="font-medium">{w.value} kg</span>
            <button onClick={() => deleteWeight(w.id)} className="text-danger text-[11px] hover:opacity-75">Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
}
