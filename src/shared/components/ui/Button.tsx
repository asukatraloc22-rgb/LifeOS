import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:opacity-85',
  secondary: 'bg-bg-3 text-text border border-border hover:border-border-2',
  ghost: 'bg-transparent text-text-2 hover:bg-bg-3 hover:text-text',
  danger: 'bg-danger/10 text-danger border border-danger/25 hover:bg-danger/20',
  success: 'bg-success/10 text-success border border-success/25 hover:bg-success/20',
};

const SIZE_STYLES: Record<Size, string> = {
  sm: 'text-xs px-2.5 py-1.5 gap-1.5',
  md: 'text-sm px-3.5 py-2 gap-2',
  lg: 'text-base px-5 py-2.5 gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
