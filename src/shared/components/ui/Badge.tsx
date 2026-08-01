import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

type Tone = 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const TONE_STYLES: Record<Tone, string> = {
  accent: 'bg-accent/15 text-accent-2 border-accent/20',
  success: 'bg-success/12 text-success border-success/20',
  warning: 'bg-warning/12 text-warning border-warning/20',
  danger: 'bg-danger/12 text-danger border-danger/20',
  info: 'bg-accent-3/12 text-accent-3 border-accent-3/20',
  neutral: 'bg-bg-4 text-text-3 border-border',
};

export function Badge({ tone = 'neutral', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border',
        TONE_STYLES[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
