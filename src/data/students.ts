import { Student, Personality } from '@/types';

const personalityDescriptions: Record<Personality, { traits: string[]; color: string }> = {
  curious: {
    traits: ['求知欲强', '喜欢探索', '学得快', '容易分心'],
    color: '#4ECDC4',
  },
  lazy: {
    traits: ['需要鼓励', '喜欢偷懒', '记忆力好', '反应慢'],
    color: '#FFE66D',
  },
  eager: {
    traits: ['积极主动', '急于表现', '容易犯错', '进步快'],
    color: '#FF6B6B',
  },
  shy: {
    traits: ['胆小害羞', '需要耐心', '学得扎实', '害怕出错'],
    color: '#9B59B6',
  },
  playful: {
    traits: ['活泼好动', '喜欢游戏', '注意力差', '记忆力强'],
    color: '#74B9FF',
  },
};

const avatarEmojis = ['🐚', '🐌', '🐚', '🌀', '🐚'];

export const initialStudents: Student[] = [
  {
    id: 's1',
    name: '螺螺',
    avatar: avatarEmojis[0],
    personality: 'curious',
    traits: personalityDescriptions.curious.traits,
    abilities: { listening: 85, comprehension: 80, memory: 70, attention: 60 },
    level: 1,
    accuracy: 0.75,
    masteredRoots: ['r1', 'r2', 'r3', 'r7', 'r8'],
    weakRoots: ['r17', 'r18', 'r25'],
    color: personalityDescriptions.curious.color,
  },
  {
    id: 's2',
    name: '贝贝',
    avatar: avatarEmojis[1],
    personality: 'lazy',
    traits: personalityDescriptions.lazy.traits,
    abilities: { listening: 60, comprehension: 70, memory: 85, attention: 50 },
    level: 1,
    accuracy: 0.6,
    masteredRoots: ['r1', 'r2', 'r4', 'r5'],
    weakRoots: ['r10', 'r11', 'r12', 'r21'],
    color: personalityDescriptions.lazy.color,
  },
  {
    id: 's3',
    name: '珊珊',
    avatar: avatarEmojis[2],
    personality: 'eager',
    traits: personalityDescriptions.eager.traits,
    abilities: { listening: 90, comprehension: 75, memory: 65, attention: 75 },
    level: 2,
    accuracy: 0.7,
    masteredRoots: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9'],
    weakRoots: ['r22', 'r25'],
    color: personalityDescriptions.eager.color,
  },
  {
    id: 's4',
    name: '海海',
    avatar: avatarEmojis[3],
    personality: 'shy',
    traits: personalityDescriptions.shy.traits,
    abilities: { listening: 70, comprehension: 85, memory: 80, attention: 85 },
    level: 1,
    accuracy: 0.8,
    masteredRoots: ['r1', 'r2', 'r3', 'r7', 'r15', 'r16'],
    weakRoots: ['r13', 'r14', 'r22'],
    color: personalityDescriptions.shy.color,
  },
  {
    id: 's5',
    name: '洋洋',
    avatar: avatarEmojis[4],
    personality: 'playful',
    traits: personalityDescriptions.playful.traits,
    abilities: { listening: 75, comprehension: 70, memory: 90, attention: 45 },
    level: 2,
    accuracy: 0.65,
    masteredRoots: ['r1', 'r2', 'r3', 'r9', 'r10', 'r20', 'r24'],
    weakRoots: ['r17', 'r18', 'r25'],
    color: personalityDescriptions.playful.color,
  },
];

export const getPersonalityLabel = (personality: Personality): string => {
  const labels: Record<Personality, string> = {
    curious: '好奇型',
    lazy: '懒散型',
    eager: '急切型',
    shy: '害羞型',
    playful: '贪玩型',
  };
  return labels[personality];
};

export const getPersonalityDescription = (personality: Personality): string => {
  const descriptions: Record<Personality, string> = {
    curious: '对一切都充满好奇，喜欢探索新事物，但容易被新奇的东西吸引而分心。',
    lazy: '懒洋洋的，需要更多鼓励才愿意学习，但一旦记住就不容易忘记。',
    eager: '学习热情很高，总是急于表现自己，但有时会因为太急而犯错。',
    shy: '比较胆小害羞，需要耐心引导，虽然学得慢但基础很扎实。',
    playful: '活泼好动，喜欢在游戏中学习，注意力不容易集中但记忆力很好。',
  };
  return descriptions[personality];
};

export const getAbilityLabel = (ability: keyof Student['abilities']): string => {
  const labels: Record<keyof Student['abilities'], string> = {
    listening: '听力',
    comprehension: '理解力',
    memory: '记忆力',
    attention: '注意力',
  };
  return labels[ability];
};
