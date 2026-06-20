import { Sentence } from '@/types';

export const initialSentences: Sentence[] = [
  {
    id: 's1',
    rootIds: ['r1', 'r2'],
    tones: [3, 3],
    gestureIds: ['g3'],
    translation: 'Hello / How are you',
    expectedAction: '点头微笑表示问候',
    createdAt: new Date().toISOString(),
  },
  {
    id: 's2',
    rootIds: ['r7', 'r3', 'r4'],
    tones: [3, 1, 4],
    gestureIds: ['g5'],
    translation: 'I eat rice',
    expectedAction: '做出吃饭的动作',
    createdAt: new Date().toISOString(),
  },
  {
    id: 's3',
    rootIds: ['r1', 'r6', 'r5'],
    tones: [3, 1, 3],
    gestureIds: ['g6'],
    translation: 'You drink water',
    expectedAction: '做出喝水的动作',
    createdAt: new Date().toISOString(),
  },
  {
    id: 's4',
    rootIds: ['r16', 'r9', 'r10'],
    tones: [3, 2, 2],
    gestureIds: ['g7'],
    translation: 'Small fish swims',
    expectedAction: '做出游泳的动作',
    createdAt: new Date().toISOString(),
  },
  {
    id: 's5',
    rootIds: ['r7', 'r8', 'r23'],
    tones: [3, 4, 2],
    gestureIds: ['g3'],
    translation: 'I am a friend',
    expectedAction: '点头表示确认',
    createdAt: new Date().toISOString(),
  },
  {
    id: 's6',
    rootIds: ['r15', 'r19'],
    tones: [4, 3],
    gestureIds: ['g10'],
    translation: 'Big sea',
    expectedAction: '用手比划出大的样子',
    createdAt: new Date().toISOString(),
  },
  {
    id: 's7',
    rootIds: ['r1', 'r11', 'r10'],
    tones: [3, 4, 2],
    gestureIds: ['g15', 'g7'],
    translation: 'You swim fast',
    expectedAction: '快速做出游泳动作',
    createdAt: new Date().toISOString(),
  },
  {
    id: 's8',
    rootIds: ['r25', 'r17'],
    tones: [3, 4],
    gestureIds: ['g10'],
    translation: 'Beautiful shell',
    expectedAction: '指着贝壳欣赏',
    createdAt: new Date().toISOString(),
  },
];

export const buildPinyinWithTones = (
  rootIds: string[],
  tones: number[],
  roots: { id: string; pinyin: string }[],
  toneMap: (pinyin: string, tone: number) => string
): string => {
  return rootIds
    .map((id, index) => {
      const root = roots.find(r => r.id === id);
      const tone = tones[index] || 0;
      if (!root) return '';
      return toneMap(root.pinyin, tone);
    })
    .join(' ');
};

export const buildCharacters = (
  rootIds: string[],
  roots: { id: string; character: string }[]
): string => {
  return rootIds
    .map(id => {
      const root = roots.find(r => r.id === id);
      return root?.character || '';
    })
    .join('');
};
