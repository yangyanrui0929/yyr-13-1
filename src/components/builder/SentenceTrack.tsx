import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { Root, Tone, Gesture } from '@/types';
import { RootCard } from './RootCard';
import { GestureCard } from './GestureCard';
import { applyToneToPinyin } from '@/data/tones';

interface SortableRootCardProps {
  root: Root;
  toneId: number;
  index: number;
  onRemove: () => void;
  onToneChange: (toneId: number) => void;
  availableTones: Tone[];
}

const SortableRootCard: React.FC<SortableRootCardProps> = ({
  root,
  toneId,
  index,
  onRemove,
  onToneChange,
  availableTones,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: root.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <RootCard
        root={root}
        toneId={toneId}
        index={index}
        onRemove={onRemove}
        onToneChange={onToneChange}
        showToneSelector
        availableTones={availableTones}
        isDragging={isDragging}
      />
    </div>
  );
};

interface SentenceTrackProps {
  roots: Root[];
  tones: number[];
  gestures: string[];
  allRoots: Root[];
  allTones: Tone[];
  allGestures: Gesture[];
  onReorderRoots: (fromIndex: number, toIndex: number) => void;
  onRemoveRoot: (index: number) => void;
  onToneChange: (rootIndex: number, toneId: number) => void;
  onRemoveGesture: (gestureId: string) => void;
  className?: string;
}

export const SentenceTrack: React.FC<SentenceTrackProps> = ({
  roots,
  tones,
  gestures,
  allRoots,
  allTones,
  allGestures,
  onReorderRoots,
  onRemoveRoot,
  onToneChange,
  onRemoveGesture,
  className,
}) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = roots.findIndex(r => r.id === active.id);
      const newIndex = roots.findIndex(r => r.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderRoots(oldIndex, newIndex);
      }
    }
  };

  const activeRoot = activeId ? allRoots.find(r => r.id === activeId) : null;
  const activeToneIndex = activeId ? roots.findIndex(r => r.id === activeId) : -1;
  const activeToneId = activeToneIndex >= 0 ? tones[activeToneIndex] : 0;

  const characters = roots.map(r => r.character).join('');
  const pinyinWithTones = roots.map((r, i) => 
    applyToneToPinyin(r.pinyin, tones[i] || 0)
  ).join(' ');

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-4">
        <h4 className="text-lg font-bold text-[var(--color-ocean-deep)] mb-2 flex items-center gap-2">
          <span className="text-2xl">📝</span>
          句式预览
        </h4>
        
        <AnimatePresence>
          {roots.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-[var(--color-ocean-deep)] to-[var(--color-ocean-mid)] rounded-2xl p-6 text-white mb-4 shadow-lg"
            >
              <div className="text-4xl font-bold font-[var(--font-display)] mb-2 text-center">
                {characters}
              </div>
              <div className="text-center text-[var(--color-foam)]">
                {pinyinWithTones}
              </div>
              {gestures.length > 0 && (
                <div className="flex justify-center gap-2 mt-3">
                  {gestures.map(gId => {
                    const gesture = allGestures.find(g => g.id === gId);
                    return gesture ? (
                      <span key={gId} className="text-2xl">{gesture.icon}</span>
                    ) : null;
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mb-6">
        <h4 className="text-lg font-bold text-[var(--color-ocean-deep)] mb-3 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          词根组合轨道
          <span className="text-sm font-normal text-[var(--color-text-muted)]">
            (拖拽调整顺序)
          </span>
        </h4>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={roots.map(r => r.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className={cn(
              'min-h-[200px] p-6 rounded-2xl border-2 border-dashed transition-all duration-300',
              roots.length === 0 
                ? 'border-[var(--color-shallow-blue)]/50 bg-[var(--color-foam)]/50 flex items-center justify-center' 
                : 'border-[var(--color-shallow-blue)]/30 bg-white'
            )}>
              {roots.length === 0 ? (
                <div className="text-center text-[var(--color-text-muted)]">
                  <div className="text-4xl mb-2">👆</div>
                  <p>从下方词库中选择词根添加到这里</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4 items-start">
                  {roots.map((root, index) => (
                    <SortableRootCard
                      key={root.id}
                      root={root}
                      toneId={tones[index] || 1}
                      index={index}
                      onRemove={() => onRemoveRoot(index)}
                      onToneChange={(toneId) => onToneChange(index, toneId)}
                      availableTones={allTones}
                    />
                  ))}
                </div>
              )}
            </div>
          </SortableContext>
          
          <DragOverlay>
            {activeId && activeRoot ? (
              <RootCard
                root={activeRoot}
                toneId={activeToneId}
                isDragging
                className="opacity-90 rotate-3"
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      
      {gestures.length > 0 && (
        <div>
          <h4 className="text-lg font-bold text-[var(--color-ocean-deep)] mb-3 flex items-center gap-2">
            <span className="text-2xl">🤝</span>
            配合手势
          </h4>
          <div className="flex flex-wrap gap-4 p-4 bg-[var(--color-seaweed)]/5 rounded-2xl border border-[var(--color-seaweed)]/20">
            {gestures.map(gId => {
              const gesture = allGestures.find(g => g.id === gId);
              return gesture ? (
                <GestureCard
                  key={gId}
                  gesture={gesture}
                  onRemove={() => onRemoveGesture(gId)}
                  selected
                  size="md"
                />
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};
