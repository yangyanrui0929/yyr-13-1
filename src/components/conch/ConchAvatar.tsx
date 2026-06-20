import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ConchReaction } from '@/types';
import { getReactionEmoji, getReactionLabel } from '@/utils/conchAI';

interface ConchAvatarProps {
  name: string;
  avatar: string;
  color: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  reaction?: ConchReaction | null;
  isProcessing?: boolean;
  showName?: boolean;
  animate?: boolean;
  className?: string;
  onClick?: () => void;
}

export const ConchAvatar: React.FC<ConchAvatarProps> = ({
  name,
  avatar,
  color,
  size = 'md',
  reaction = null,
  isProcessing = false,
  showName = true,
  animate = true,
  className,
  onClick,
}) => {
  const sizes = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-24 h-24 text-4xl',
    lg: 'w-36 h-36 text-6xl',
    xl: 'w-48 h-48 text-8xl',
  };
  
  const nameSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative">
        <motion.div
          className={cn(
            'rounded-full flex items-center justify-center shadow-lg cursor-pointer relative overflow-hidden',
            sizes[size],
            animate ? 'animate-float-slow' : ''
          )}
          style={{ 
            background: `linear-gradient(135deg, ${color}40 0%, ${color}80 100%)`,
            border: `4px solid ${color}`,
          }}
          onClick={onClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
          <span className="relative z-10">{avatar}</span>
          
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/10 to-transparent" />
          
          <div className="absolute top-2 left-4 w-4 h-4 rounded-full bg-white/40 blur-sm" />
          <div className="absolute top-4 left-6 w-2 h-2 rounded-full bg-white/60" />
        </motion.div>
        
        <AnimatePresence>
          {reaction && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: -10 }}
              className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg border-2"
              style={{ borderColor: color }}
            >
              <span className="text-xl">{getReactionEmoji(reaction)}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full"
            >
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {showName && (
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'mt-2 font-bold font-[var(--font-display)]',
            nameSizes[size]
          )}
          style={{ color }}
        >
          {name}
        </motion.span>
      )}
      
      {reaction && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-[var(--color-text-secondary)] mt-1"
        >
          {getReactionLabel(reaction)}
        </motion.span>
      )}
    </div>
  );
};

interface ConchExpressionProps {
  reaction: ConchReaction;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ConchExpression: React.FC<ConchExpressionProps> = ({
  reaction,
  size = 'md',
  className,
}) => {
  const sizes = {
    sm: 'text-3xl',
    md: 'text-5xl',
    lg: 'text-7xl',
  };
  
  const expressions: Record<ConchReaction, { eyes: string; mouth: string; color: string }> = {
    happy: { eyes: '◠ ◠', mouth: '‿', color: '#4ECDC4' },
    confused: { eyes: '◔ ◔', mouth: '︵', color: '#FFE66D' },
    bored: { eyes: '− −', mouth: '︶', color: '#9B59B6' },
    excited: { eyes: '★ ★', mouth: '◡', color: '#FF6B6B' },
    thinking: { eyes: '◕ ◕', mouth: '○', color: '#74B9FF' },
    surprised: { eyes: '⊙ ⊙', mouth: 'O', color: '#FFE66D' },
  };
  
  const expr = expressions[reaction];
  
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className={cn(sizes[size], 'flex flex-col items-center leading-none')} style={{ color: expr.color }}>
        <span className="animate-blink">{expr.eyes}</span>
        <span className="mt-1">{expr.mouth}</span>
      </div>
    </div>
  );
};

interface TentacleProps {
  color: string;
  position: 'left' | 'right';
  delay?: number;
  className?: string;
}

export const Tentacle: React.FC<TentacleProps> = ({
  color,
  position,
  delay = 0,
  className,
}) => {
  return (
    <motion.div
      className={cn(
        'absolute bottom-0 w-8 h-20 rounded-t-full origin-bottom animate-tentacle',
        position === 'left' ? 'left-4 -rotate-12' : 'right-4 rotate-12',
        className
      )}
      style={{
        background: `linear-gradient(to top, ${color}, ${color}80)`,
        animationDelay: `${delay}s`,
      }}
    />
  );
};
