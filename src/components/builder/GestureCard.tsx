import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Gesture } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface GestureCardProps {
  gesture: Gesture;
  onRemove?: () => void;
  onClick?: () => void;
  selected?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const GestureCard: React.FC<GestureCardProps> = ({
  gesture,
  onRemove,
  onClick,
  selected = false,
  size = 'md',
  className,
}) => {
  const sizes = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-20 h-20 text-3xl',
    lg: 'w-24 h-24 text-4xl',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={cn(
        'relative group cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <motion.div
        className={cn(
          'rounded-2xl flex items-center justify-center shadow-[var(--shadow-soft)] border-2 transition-all duration-300',
          sizes[size],
          selected 
            ? 'bg-gradient-to-br from-[var(--color-seaweed)]/20 to-[var(--color-seaweed)]/10 border-[var(--color-seaweed)] shadow-[var(--shadow-glow)]' 
            : 'bg-white border-transparent hover:border-[var(--color-seaweed)]/50 hover:bg-[var(--color-seaweed)]/5'
        )}
        whileHover={{ y: -3, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="select-none">{gesture.icon}</span>
      </motion.div>
      
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--color-coral)] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-[var(--color-coral-light)]"
        >
          <X size={12} />
        </button>
      )}
      
      <div className="text-center mt-1">
        <Badge 
          variant="seaweed" 
          size="sm"
          className="text-[10px] whitespace-nowrap"
        >
          {gesture.name}
        </Badge>
      </div>
    </motion.div>
  );
};
