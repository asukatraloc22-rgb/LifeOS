import type { ReactNode } from 'react';
import { Card } from './Card';
import { cn } from '@/shared/utils/cn';

interface StatCardProps {
  label: string;
  value: ReactNode;
  change?: { value: string; direction: 'up' | 'down' | 'neutral' };
  icon?: ReactNode;
}

const DIRECTION_COLOR = {
  up: 'text-success',
  down: 'text-danger',
  neutral: 'text-text-3',
};

export function StatCard({ label, value, change, icon }: StatCardProps) {
  return (
    <Card padding="md">
      <div className="flex items-start justify-between">
        <span className="text-[9px] uppercase tracking-wider text-text-3 font-medium">{label}</span>
        {icon}
      </div>
      <div className="font-display text-xl font-bold tracking-tight mt-1">{value}</div>
      {change && (
        <div className={cn('text-[10px] mt-1', DIRECTION_COLOR[change.direction])}>{change.value}</div>
      )}
    </Card>
  );
}
