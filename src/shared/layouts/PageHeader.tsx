import type { ReactNode } from 'react';

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h1 className="font-display text-[22px] font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="text-[11px] text-text-2 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
