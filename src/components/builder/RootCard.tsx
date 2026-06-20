import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Root, Tone } from '@/types';
import { getCategoryLabel, getCategoryColor } from '@/data/roots';
import { applyToneToPinyin, getToneSymbol } from '@/data/tones';
import { Badge } from '@/components/ui/Badge';

interface RootCardProps {
  root: Root;
  tone?: Tone | null;
  toneId?: number;
  onToneChange?: (toneId: number) => void;
  onRemove?: () => void;
  index?: number;
  isDragging?: boolean;
  onClick?: () => void;
  selectable?: boolean;
  selected?: boolean;
  showToneSelector?: boolean;
  availableTones?: Tone[];
  className?: string;
}

export const RootCard: React.FC<RootCardProps> = ({
  root,
  tone = null,
  toneId = 0,
  onToneChange,
  onRemove,
  index,
  isDragging = false,
  onClick,
  selectable = false,
  selected = false,
  showToneSelector = false,
  availableTones = [],
  className,
}) => {
  const categoryColor = getCategoryColor(root.category);
  const displayPinyin = toneId > 0 && toneId <= 5 
    ? applyToneToPinyin(root.pinyin, toneId) 
    : root.pinyin;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: isDragging ? 1.1 : 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={cn(
        'relative bg-white rounded-2xl shadow-[var(--shadow-soft)] border-2 p-4 cursor-pointer transition-all duration-300 group',
        selectable && selected ? 'border-[var(--color-seaweed)] shadow-[var(--shadow-glow)]' : 'border-transparent hover:border-[var(--color-shallow-blue)]',
        isDragging ? 'shadow-[var(--shadow-large)] rotate-3' : '',
        className
      )}
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.95 }}
    >
      {index !== undefined && (
        <div 
          className="absolute -top-2 -left-2 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-md"
          style={{ backgroundColor: categoryColor }}
        >
          {index + 1}
        </div>
      )}
      
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--color-coral)] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-[var(--color-coral-light)]"
        >
          <X size={14} />
        </button>
      )}
      
      <div className="text-center">
        <div 
          className="text-4xl font-bold font-[var(--font-display)] mb-2"
          style={{ color: categoryColor }}
        >
          {root.character}
        </div>
        
        <div className="text-sm text-[var(--color-text-secondary)] mb-2">
          {displayPinyin}
          {toneId > 0 && toneId <= 5 && (
            <span 
              className="ml-1 font-bold"
              style={{ color: availableTones.find(t => t.id === toneId)?.color }}
            >
              {getToneSymbol(toneId)}
            </span>
          )}
        </div>
        
        <div className="text-xs text-[var(--color-text-muted)] mb-2">
          {root.meaning}
        </div>
        
        <Badge 
          variant="secondary" 
          size="sm"
          className="text-[10px]"
          style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
        >
          {getCategoryLabel(root.category)}
        </Badge>
        
        <div className="flex gap-0.5 mt-2 justify-center">
          {Array.from({ length: root.difficulty }).map((_, i) => (
            <div 
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: categoryColor }}
            />
          ))}
        </div>
      </div>
      
      {showToneSelector && availableTones.length > 0 && onToneChange && (
        <div className="mt-3 pt-3 border-t border-[var(--color-foam)]">
          <div className="text-xs text-[var(--color-text-muted)] mb-2">声调：</div>
          <div className="flex gap-1 justify-center">
            {availableTones.map((t) => (
              <button
                key={t.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onToneChange(t.id);
                }}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200',
                  toneId === t.id 
                    ? 'text-white scale-110 shadow-md' 
                    : 'bg-[var(--color-foam)] text-[var(--color-text-secondary)] hover:bg-[var(--color-shallow-blue)]/20'
                )}
                style={{ 
                  backgroundColor: toneId === t.id ? t.color : undefined,
                  color: toneId === t.id ? 'white' : t.color,
                }}
                title={t.name}
              >
                {t.symbol}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
