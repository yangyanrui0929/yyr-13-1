import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'coral' | 'seaweed' | 'sand' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'rounded' | 'pill' | 'drop';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  shape = 'pill',
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium';
  
  const variants = {
    primary: 'bg-[var(--color-ocean-deep)] text-white',
    secondary: 'bg-[var(--color-shallow-blue)]/20 text-[var(--color-ocean-deep)]',
    success: 'bg-[var(--color-success)] text-white',
    warning: 'bg-[var(--color-warning)] text-white',
    danger: 'bg-[var(--color-error)] text-white',
    info: 'bg-[var(--color-info)] text-white',
    coral: 'bg-[var(--color-coral)]/20 text-[var(--color-coral)]',
    seaweed: 'bg-[var(--color-seaweed)]/20 text-[var(--color-ocean-deep)]',
    sand: 'bg-[var(--color-sand)]/30 text-[var(--color-ocean-deep)]',
    purple: 'bg-[var(--color-conch-purple)]/20 text-[var(--color-conch-purple)]',
  };
  
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };
  
  const shapes = {
    rounded: 'rounded-[var(--radius-sm)]',
    pill: 'rounded-full',
    drop: 'rounded-b-full rounded-t-[var(--radius-sm)]',
  };
  
  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        shapes[shape],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
