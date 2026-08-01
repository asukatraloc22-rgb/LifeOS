import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const PADDING: Record<string, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({ padding = 'md', hoverable, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-bg-2 border border-border rounded-xl',
        PADDING[padding],
        hoverable && 'transition-colors hover:border-border-2 cursor-pointer',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
