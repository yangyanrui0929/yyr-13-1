import { Gesture } from '@/types';

export const initialGestures: Gesture[] = [
  {
    id: 'g1',
    name: '招手',
    icon: '👋',
    description: '招手示意过来',
    associatedRoots: ['r13', 'r7'],
  },
  {
    id: 'g2',
    name: '指向',
    icon: '👉',
    description: '指向某个方向或物体',
    associatedRoots: ['r14', 'r20'],
  },
  {
    id: 'g3',
    name: '点头',
    icon: '🙂',
    description: '点头表示肯定',
    associatedRoots: ['r2', 'r8'],
  },
  {
    id: 'g4',
    name: '摇头',
    icon: '😕',
    description: '摇头表示否定',
    associatedRoots: ['r2', 'r8'],
  },
  {
    id: 'g5',
    name: '吃东西',
    icon: '🍽️',
    description: '模拟吃东西的动作',
    associatedRoots: ['r3', 'r4'],
  },
  {
    id: 'g6',
    name: '喝水',
    icon: '🥤',
    description: '模拟喝水的动作',
    associatedRoots: ['r5', 'r6'],
  },
  {
    id: 'g7',
    name: '游泳',
    icon: '🏊',
    description: '模拟游泳的动作',
    associatedRoots: ['r10', 'r19'],
  },
  {
    id: 'g8',
    name: '变大',
    icon: '📏',
    description: '双手张开表示变大',
    associatedRoots: ['r15'],
  },
  {
    id: 'g9',
    name: '变小',
    icon: '🔍',
    description: '双手合拢表示变小',
    associatedRoots: ['r16'],
  },
  {
    id: 'g10',
    name: '看',
    icon: '👀',
    description: '手指向眼睛表示看',
    associatedRoots: ['r20'],
  },
  {
    id: 'g11',
    name: '听',
    icon: '👂',
    description: '手指向耳朵表示听',
    associatedRoots: ['r21'],
  },
  {
    id: 'g12',
    name: '说话',
    icon: '💬',
    description: '手指向嘴巴表示说话',
    associatedRoots: ['r22'],
  },
  {
    id: 'g13',
    name: '开心',
    icon: '😄',
    description: '笑脸表示开心',
    associatedRoots: ['r2', 'r24'],
  },
  {
    id: 'g14',
    name: '困惑',
    icon: '🤔',
    description: '挠头表示困惑',
    associatedRoots: [],
  },
  {
    id: 'g15',
    name: '快',
    icon: '⚡',
    description: '快速挥手表示快',
    associatedRoots: ['r11'],
  },
  {
    id: 'g16',
    name: '慢',
    icon: '🐢',
    description: '缓慢挥手表示慢',
    associatedRoots: ['r12'],
  },
];

export const getGestureIcon = (gestureId: string): string => {
  const gesture = initialGestures.find(g => g.id === gestureId);
  return gesture?.icon || '❓';
};
