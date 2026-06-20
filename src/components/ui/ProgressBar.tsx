import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'ocean' | 'coral' | 'seaweed' | 'sand' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  wave?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'ocean',
  size = 'md',
  showLabel = false,
  animated = true,
  wave = true,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const variants = {
    ocean: 'bg-gradient-to-r from-[var(--color-ocean-light)] to-[var(--color-ocean-deep)]',
    coral: 'bg-gradient-to-r from-[var(--color-coral-light)] to-[var(--color-coral)]',
    seaweed: 'bg-gradient-to-r from-[var(--color-seaweed-light)] to-[var(--color-seaweed)]',
    sand: 'bg-gradient-to-r from-[var(--color-sand-light)] to-[var(--color-sand)]',
    purple: 'bg-gradient-to-r from-[var(--color-conch-light)] to-[var(--color-conch-purple)]',
  };
  
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };
  
  return (
    <div className={cn('w-full', className)}>
      <div className={cn(
        'w-full bg-[var(--color-foam)] rounded-full overflow-hidden relative',
        sizes[size]
      )}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden',
            variants[variant],
            animated ? 'animate-pulse' : ''
          )}
          style={{ width: `${percentage}%` }}
        >
          {wave && (
            <div className="absolute inset-0 opacity-50">
              <div 
                className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 1200 120%27 preserveAspectRatio=%27none%27%3E%3Cpath d=%27M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z%27 fill=%27white%27 opacity=%270.3%27/%3E%3C/svg%3E')]"
                style={{
                  backgroundSize: '200% 100%',
                  animation: 'wave 3s linear infinite',
                }}
              />
            </div>
          )}
        </div>
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-[var(--color-text-muted)]">进度</span>
          <span className="text-xs font-medium text-[var(--color-ocean-deep)]">{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
};
