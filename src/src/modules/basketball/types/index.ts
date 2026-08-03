export interface DayExercise {
  id: string;
  name: string;
  sub: string;
}

export interface ProgramDay {
  key: string;
  label: string;
  title: string;
  type: 'strength' | 'basket' | 'legday';
  jump?: boolean;
  iso?: boolean;
  shooting?: boolean;
  technique?: string;
  exercises: DayExercise[];
}

export interface SessionExerciseLog {
  name: string;
  done: boolean;
  weight: string;
  reps: string;
}

export interface SessionEntry {
  id: string;
  date: string;
  day: string;
  dayLabel: string;
  title: string;
  fatigue: number;
  note: string;
  mobilite: boolean;
  plyo: boolean | null;
  technique: boolean | null;
  shootAtt: number | null;
  shootMade: number | null;
  exercises: SessionExerciseLog[];
}

export interface WeightEntry {
  id: string;
  date: string;
  value: number;
}

export type InjuryStatus = 'Active' | 'En amélioration' | 'Guérie';

export interface InjuryEntry {
  id: string;
  date: string;
  type: string;
  pain: number;
  status: InjuryStatus;
  note: string;
}

export interface InjuryTypeInfo {
  id: string;
  name: string;
  short: string;
  signs: string;
  care: string;
  avoid: string;
}
