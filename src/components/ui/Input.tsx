import React from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'shell' | 'coral';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  className,
  variant = 'default',
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseStyles = 'w-full px-4 py-3 rounded-full border-2 transition-all duration-300 focus:outline-none';
  
  const variants = {
    default: 'bg-white border-[var(--color-shallow-blue)]/30 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-ocean-mid)] focus:ring-4 focus:ring-[var(--color-ocean-mid)]/10',
    shell: 'bg-white/80 backdrop-blur-sm border-[var(--color-sand)]/50 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-sand)] focus:ring-4 focus:ring-[var(--color-sand)]/20',
    coral: 'bg-white border-[var(--color-coral)]/30 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-coral)] focus:ring-4 focus:ring-[var(--color-coral)]/10',
  };
  
  return (
    <div className="relative">
      {leftIcon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
          {leftIcon}
        </div>
      )}
      <input
        className={cn(
          baseStyles,
          variants[variant],
          leftIcon ? 'pl-12' : '',
          rightIcon ? 'pr-12' : '',
          className
        )}
        {...props}
      />
      {rightIcon && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
          {rightIcon}
        </div>
      )}
    </div>
  );
};

interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onSearch?: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  onChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    onSearch?.(e.target.value);
  };
  
  return (
    <Input
      leftIcon={<Search size={18} />}
      onChange={handleChange}
      {...props}
    />
  );
};
