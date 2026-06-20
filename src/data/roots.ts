import { Root } from '@/types';

export const initialRoots: Root[] = [
  { id: 'r1', character: '你', pinyin: 'nǐ', meaning: 'you', category: 'pronoun', difficulty: 1, examples: ['你好', '你是谁'] },
  { id: 'r2', character: '好', pinyin: 'hǎo', meaning: 'good', category: 'adjective', difficulty: 1, examples: ['你好', '好吃'] },
  { id: 'r3', character: '吃', pinyin: 'chī', meaning: 'eat', category: 'verb', difficulty: 1, examples: ['吃饭', '吃东西'] },
  { id: 'r4', character: '饭', pinyin: 'fàn', meaning: 'rice/food', category: 'noun', difficulty: 1, examples: ['吃饭', '米饭'] },
  { id: 'r5', character: '水', pinyin: 'shuǐ', meaning: 'water', category: 'noun', difficulty: 1, examples: ['喝水', '水果'] },
  { id: 'r6', character: '喝', pinyin: 'hē', meaning: 'drink', category: 'verb', difficulty: 1, examples: ['喝水', '喝茶'] },
  { id: 'r7', character: '我', pinyin: 'wǒ', meaning: 'I/me', category: 'pronoun', difficulty: 1, examples: ['我是', '我的'] },
  { id: 'r8', character: '是', pinyin: 'shì', meaning: 'to be', category: 'verb', difficulty: 1, examples: ['是我', '是谁'] },
  { id: 'r9', character: '鱼', pinyin: 'yú', meaning: 'fish', category: 'noun', difficulty: 2, examples: ['小鱼', '吃鱼'] },
  { id: 'r10', character: '游', pinyin: 'yóu', meaning: 'swim', category: 'verb', difficulty: 2, examples: ['游泳', '游来游去'] },
  { id: 'r11', character: '快', pinyin: 'kuài', meaning: 'fast/quick', category: 'adjective', difficulty: 2, examples: ['快点', '跑得快'] },
  { id: 'r12', character: '慢', pinyin: 'màn', meaning: 'slow', category: 'adjective', difficulty: 2, examples: ['慢点', '走得慢'] },
  { id: 'r13', character: '来', pinyin: 'lái', meaning: 'come', category: 'verb', difficulty: 1, examples: ['过来', '来到'] },
  { id: 'r14', character: '去', pinyin: 'qù', meaning: 'go', category: 'verb', difficulty: 1, examples: ['过去', '去哪里'] },
  { id: 'r15', character: '大', pinyin: 'dà', meaning: 'big/large', category: 'adjective', difficulty: 1, examples: ['大鱼', '很大'] },
  { id: 'r16', character: '小', pinyin: 'xiǎo', meaning: 'small/little', category: 'adjective', difficulty: 1, examples: ['小鱼', '很小'] },
  { id: 'r17', character: '贝壳', pinyin: 'bèi ké', meaning: 'shell', category: 'noun', difficulty: 3, examples: ['美丽的贝壳'] },
  { id: 'r18', character: '珊瑚', pinyin: 'shān hú', meaning: 'coral', category: 'noun', difficulty: 3, examples: ['红色的珊瑚'] },
  { id: 'r19', character: '海', pinyin: 'hǎi', meaning: 'sea/ocean', category: 'noun', difficulty: 2, examples: ['大海', '海水'] },
  { id: 'r20', character: '看', pinyin: 'kàn', meaning: 'look/see', category: 'verb', difficulty: 1, examples: ['看看', '看海'] },
  { id: 'r21', character: '听', pinyin: 'tīng', meaning: 'listen', category: 'verb', difficulty: 2, examples: ['听话', '听声音'] },
  { id: 'r22', character: '说', pinyin: 'shuō', meaning: 'speak/say', category: 'verb', difficulty: 2, examples: ['说话', '说什么'] },
  { id: 'r23', character: '朋友', pinyin: 'péng you', meaning: 'friend', category: 'noun', difficulty: 2, examples: ['好朋友', '我的朋友'] },
  { id: 'r24', character: '玩', pinyin: 'wán', meaning: 'play', category: 'verb', difficulty: 2, examples: ['玩耍', '出去玩'] },
  { id: 'r25', character: '美丽', pinyin: 'měi lì', meaning: 'beautiful', category: 'adjective', difficulty: 3, examples: ['美丽的海', '美丽的贝壳'] },
];

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    noun: '名词',
    verb: '动词',
    adjective: '形容词',
    adverb: '副词',
    pronoun: '代词',
    particle: '助词',
  };
  return labels[category] || category;
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    noun: 'var(--color-coral)',
    verb: 'var(--color-seaweed)',
    adjective: 'var(--color-sand)',
    adverb: 'var(--color-conch-purple)',
    pronoun: 'var(--color-shallow-blue)',
    particle: 'var(--color-text-muted)',
  };
  return colors[category] || 'var(--color-text-secondary)';
};
