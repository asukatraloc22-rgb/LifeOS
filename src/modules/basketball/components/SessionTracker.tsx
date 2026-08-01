import { useState } from 'react';
import { PROGRAM, DAY_ORDER } from '../data/program';
import { useBasketballStore } from '../store/useBasketballStore';
import { Card, Button, Badge } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

const TYPE_TONE: Record<string, 'accent' | 'info' | 'success'> = {
  strength: 'accent',
  legday: 'accent',
  basket: 'info',
};

export function SessionTracker() {
  const [currentDay, setCurrentDay] = useState(DAY_ORDER[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  const day = PROGRAM[currentDay];
  const addSession = useBasketballStore((s) => s.addSession);

  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [weights, setWeights] = useState<Record<string, string>>({});
  const [reps, setReps] = useState<Record<string, string>>({});
  const [fatigue, setFatigue] = useState('3');
  const [note, setNote] = useState('');
  const [shootAtt, setShootAtt] = useState('');
  const [shootMade, setShootMade] = useState('');
  const [saved, setSaved] = useState(false);

  function switchDay(key: string) {
    setCurrentDay(key);
    setChecks({});
    setWeights({});
    setReps({});
    setNote('');
    setShootAtt('');
    setShootMade('');
  }

  function save() {
    addSession({
      date: new Date().toISOString().slice(0, 10),
      day: currentDay,
      dayLabel: day.label,
      title: day.title,
      fatigue: Number(fatigue),
      note,
      mobilite: !!checks.mobilite,
      plyo: day.jump ? !!checks.plyo : null,
      technique: day.technique || day.shooting ? !!checks.technique : null,
      shootAtt: day.shooting ? Number(shootAtt) || null : null,
      shootMade: day.shooting ? Number(shootMade) || null : null,
      exercises: day.exercises.map((ex) => ({
        name: ex.name,
        done: !!checks[ex.id],
        weight: weights[ex.id] ?? '',
        reps: reps[ex.id] ?? '',
      })),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 flex-wrap">
        {DAY_ORDER.map((key) => (
          <button
            key={key}
            onClick={() => switchDay(key)}
            className={cn(
              'flex-1 min-w-[85px] text-center text-xs px-2 py-2 rounded-lg border transition-colors',
              key === currentDay
                ? 'border-accent text-accent-2 bg-accent/10 font-semibold'
                : 'border-border text-text-2 hover:border-border-2',
            )}
          >
            {PROGRAM[key].label}
          </button>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-sm">{day.label} — {day.title}</h3>
          <Badge tone={TYPE_TONE[day.type]}>{day.type}</Badge>
        </div>

        <ExerciseRow
          label="Mobilité matinale (cheville + hanches + épaules)"
          sub="8-10 min, sans douleur"
          checked={!!checks.mobilite}
          onCheck={(v) => setChecks((c) => ({ ...c, mobilite: v }))}
        />

        {day.jump && (
          <ExerciseRow
            label="Séance saut / plyo"
            sub={day.type === 'legday' ? 'Créneau principal, matin' : 'Créneau léger, qualité'}
            checked={!!checks.plyo}
            onCheck={(v) => setChecks((c) => ({ ...c, plyo: v }))}
          />
        )}

        {(day.technique || day.shooting) && (
          <ExerciseRow
            label={day.technique ? `Séance technique : ${day.technique}` : 'Séance technique tir'}
            sub="Consigne du programme"
            checked={!!checks.technique}
            onCheck={(v) => setChecks((c) => ({ ...c, technique: v }))}
          />
        )}

        {day.shooting && (
          <div className="grid grid-cols-2 gap-3 my-3">
            <LabeledInput label="Tirs tentés" value={shootAtt} onChange={setShootAtt} type="number" />
            <LabeledInput label="Tirs réussis" value={shootMade} onChange={setShootMade} type="number" />
          </div>
        )}

        {day.exercises.map((ex) => (
          <div key={ex.id} className="grid grid-cols-[auto_1fr_70px_70px] gap-2 items-center py-2 border-b border-border last:border-0">
            <input
              type="checkbox"
              className="w-4 h-4 accent-accent"
              checked={!!checks[ex.id]}
              onChange={(e) => setChecks((c) => ({ ...c, [ex.id]: e.target.checked }))}
            />
            <div>
              <div className="text-xs text-text">{ex.name}</div>
              <div className="text-[10px] text-text-3">{ex.sub}</div>
            </div>
            <input
              type="number"
              step="0.5"
              placeholder="kg"
              className="bg-bg-3 border border-border-2 rounded-md px-2 py-1.5 text-xs w-full"
              value={weights[ex.id] ?? ''}
              onChange={(e) => setWeights((w) => ({ ...w, [ex.id]: e.target.value }))}
            />
            <input
              type="text"
              placeholder="reps"
              className="bg-bg-3 border border-border-2 rounded-md px-2 py-1.5 text-xs w-full"
              value={reps[ex.id] ?? ''}
              onChange={(e) => setReps((r) => ({ ...r, [ex.id]: e.target.value }))}
            />
          </div>
        ))}

        {day.type === 'basket' && day.exercises.length === 0 && (
          <p className="text-xs text-text-2 mt-2">Journée basket — note ta séance ci-dessous si besoin.</p>
        )}

        <div className="mt-4">
          <label className="block text-[10px] uppercase text-text-3 mb-1">Fatigue ressentie</label>
          <select
            className="bg-bg-3 border border-border-2 rounded-md px-2 py-1.5 text-xs w-full"
            value={fatigue}
            onChange={(e) => setFatigue(e.target.value)}
          >
            <option value="1">1 - Très frais</option>
            <option value="2">2 - Frais</option>
            <option value="3">3 - Normal</option>
            <option value="4">4 - Fatigué</option>
            <option value="5">5 - Très fatigué</option>
          </select>
        </div>

        <div className="mt-3">
          <label className="block text-[10px] uppercase text-text-3 mb-1">Note</label>
          <textarea
            className="bg-bg-3 border border-border-2 rounded-md px-2 py-2 text-xs w-full resize-none h-16"
            placeholder="Sensations, cheville, poids qui montent..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 mt-4">
          <Button onClick={save}>Enregistrer la séance</Button>
          {saved && <span className="text-xs text-success">Séance enregistrée ✓</span>}
        </div>
      </Card>
    </div>
  );
}

function ExerciseRow({ label, sub, checked, onCheck }: { label: string; sub: string; checked: boolean; onCheck: (v: boolean) => void }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-2 items-center py-2 border-b border-border">
      <input type="checkbox" className="w-4 h-4 accent-accent" checked={checked} onChange={(e) => onCheck(e.target.checked)} />
      <div>
        <div className="text-xs text-text">{label}</div>
        <div className="text-[10px] text-text-3">{sub}</div>
      </div>
    </div>
  );
}

function LabeledInput({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-[10px] uppercase text-text-3 mb-1">{label}</label>
      <input
        type={type}
        className="bg-bg-3 border border-border-2 rounded-md px-2 py-1.5 text-xs w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
