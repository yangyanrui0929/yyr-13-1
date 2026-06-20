import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  loading = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[var(--color-ocean-mid)] to-[var(--color-ocean-deep)] text-white hover:shadow-lg hover:shadow-[var(--color-ocean-mid)]/30 focus:ring-[var(--color-ocean-mid)] hover:-translate-y-0.5',
    secondary: 'bg-white text-[var(--color-ocean-deep)] border-2 border-[var(--color-shallow-blue)] hover:bg-[var(--color-foam)] focus:ring-[var(--color-shallow-blue)]',
    success: 'bg-gradient-to-r from-[var(--color-seaweed)] to-[var(--color-seaweed-light)] text-white hover:shadow-lg hover:shadow-[var(--color-seaweed)]/30 focus:ring-[var(--color-seaweed)]',
    warning: 'bg-gradient-to-r from-[var(--color-sand)] to-[var(--color-sand-light)] text-[var(--color-ocean-deep)] hover:shadow-lg hover:shadow-[var(--color-sand)]/30 focus:ring-[var(--color-sand)]',
    danger: 'bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-light)] text-white hover:shadow-lg hover:shadow-[var(--color-coral)]/30 focus:ring-[var(--color-coral)]',
    ghost: 'bg-transparent text-[var(--color-ocean-deep)] hover:bg-[var(--color-foam)] focus:ring-[var(--color-shallow-blue)]',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
    xl: 'px-9 py-4.5 text-lg gap-3',
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        widthStyle,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && leftIcon}
      {children}
      {rightIcon}
    </button>
  );
};
