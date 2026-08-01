import { cn } from '@/shared/utils/cn';

interface ProgressBarProps {
  value: number; // 0-100
  tone?: 'accent' | 'success' | 'warning' | 'danger';
  className?: string;
}

const TONE_BG: Record<string, string> = {
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

export function ProgressBar({ value, tone = 'accent', className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn('h-1.5 rounded-full bg-bg-4 overflow-hidden', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-500', TONE_BG[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
