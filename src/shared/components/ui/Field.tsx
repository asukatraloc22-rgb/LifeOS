import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

const fieldBase =
  'w-full bg-bg-3 border border-border-2 rounded-lg px-3 py-2 text-sm text-text outline-none transition-colors focus:border-accent';

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wide text-text-3 mb-1">{label}</label>
      {children}
    </div>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldBase, className)} {...props}>
      {children}
    </select>
  );
}
