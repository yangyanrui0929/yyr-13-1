import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'ocean' | 'coral' | 'sand' | 'seaweed';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hover = false,
  padding = 'md',
  className,
  ...props
}) => {
  const baseStyles = 'rounded-[var(--radius-lg)] transition-all duration-300';
  
  const variants = {
    default: 'bg-white shadow-[var(--shadow-soft)]',
    glass: 'bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] shadow-[var(--shadow-medium)]',
    ocean: 'bg-gradient-to-br from-[var(--color-foam)] to-white shadow-[var(--shadow-soft)] border border-[var(--color-shallow-blue)]/20',
    coral: 'bg-gradient-to-br from-white to-[var(--color-coral)]/10 shadow-[var(--shadow-soft)] border border-[var(--color-coral)]/20',
    sand: 'bg-gradient-to-br from-white to-[var(--color-sand)]/10 shadow-[var(--shadow-soft)] border border-[var(--color-sand)]/30',
    seaweed: 'bg-gradient-to-br from-white to-[var(--color-seaweed)]/10 shadow-[var(--shadow-soft)] border border-[var(--color-seaweed)]/20',
  };
  
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };
  
  const hoverStyles = hover ? 'hover:shadow-[var(--shadow-large)] hover:-translate-y-1 cursor-pointer' : '';
  
  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        paddings[padding],
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('mb-4 pb-4 border-b border-[var(--color-foam)]', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h3 className={cn('text-xl font-bold text-[var(--color-ocean-deep)]', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => (
  <p className={cn('text-sm text-[var(--color-text-secondary)] mt-1', className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('mt-4 pt-4 border-t border-[var(--color-foam)]', className)} {...props}>
    {children}
  </div>
);
