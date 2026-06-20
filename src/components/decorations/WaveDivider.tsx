import React from 'react';
import { cn } from '@/lib/utils';

interface WaveDividerProps {
  variant?: 'ocean' | 'coral' | 'sand' | 'seaweed';
  height?: 'sm' | 'md' | 'lg';
  flip?: boolean;
  className?: string;
}

export const WaveDivider: React.FC<WaveDividerProps> = ({
  variant = 'ocean',
  height = 'md',
  flip = false,
  className,
}) => {
  const colors = {
    ocean: '#74B9FF',
    coral: '#FF6B6B',
    sand: '#FFE66D',
    seaweed: '#4ECDC4',
  };
  
  const heights = {
    sm: 'h-8',
    md: 'h-16',
    lg: 'h-24',
  };
  
  return (
    <div className={cn('w-full overflow-hidden', heights[height], flip ? 'rotate-180' : '', className)}>
      <svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none" 
        className="w-full h-full"
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          fill={colors[variant]}
        />
      </svg>
    </div>
  );
};

interface BubbleProps {
  count?: number;
  variant?: 'light' | 'dark' | 'coral';
  className?: string;
}

export const BubbleBackground: React.FC<BubbleProps> = ({
  count = 10,
  variant = 'light',
  className,
}) => {
  const colors = {
    light: 'rgba(255, 255, 255, 0.3)',
    dark: 'rgba(15, 76, 129, 0.1)',
    coral: 'rgba(255, 107, 107, 0.2)',
  };
  
  const bubbles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 10 + Math.random() * 30,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
  }));
  
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full animate-bubble"
          style={{
            left: `${bubble.left}%`,
            bottom: '-50px',
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            backgroundColor: colors[variant],
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${bubble.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  delay = 0,
  className,
}) => {
  return (
    <div
      className={cn('animate-float-slow', className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};
