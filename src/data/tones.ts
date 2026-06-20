import { Tone } from '@/types';

export const initialTones: Tone[] = [
  {
    id: 1,
    name: '第一声',
    symbol: 'ˉ',
    description: '阴平，高平调，声音高而平',
    pitchPattern: [5, 5, 5],
    color: '#FF6B6B',
  },
  {
    id: 2,
    name: '第二声',
    symbol: 'ˊ',
    description: '阳平，中升调，声音从中升到高',
    pitchPattern: [3, 4, 5],
    color: '#FFE66D',
  },
  {
    id: 3,
    name: '第三声',
    symbol: 'ˇ',
    description: '上声，降升调，声音先降后升',
    pitchPattern: [2, 1, 4],
    color: '#4ECDC4',
  },
  {
    id: 4,
    name: '第四声',
    symbol: 'ˋ',
    description: '去声，全降调，声音从高降到低',
    pitchPattern: [5, 3, 1],
    color: '#9B59B6',
  },
  {
    id: 5,
    name: '轻声',
    symbol: '·',
    description: '轻声，短而轻，没有固定调值',
    pitchPattern: [2, 2, 2],
    color: '#7A94AD',
  },
];

export const applyToneToPinyin = (pinyin: string, toneId: number): string => {
  const toneMarks: Record<number, Record<string, string>> = {
    1: { a: 'ā', e: 'ē', i: 'ī', o: 'ō', u: 'ū', ü: 'ǖ' },
    2: { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', ü: 'ǘ' },
    3: { a: 'ǎ', e: 'ě', i: 'ǐ', o: 'ǒ', u: 'ǔ', ü: 'ǚ' },
    4: { a: 'à', e: 'è', i: 'ì', o: 'ò', u: 'ù', ü: 'ǜ' },
    5: { a: 'a', e: 'e', i: 'i', o: 'o', u: 'u', ü: 'ü' },
  };

  if (toneId === 5 || toneId === 0) return pinyin;
  
  const marks = toneMarks[toneId];
  if (!marks) return pinyin;

  const vowels = ['a', 'o', 'e', 'i', 'u', 'ü'];
  for (const vowel of vowels) {
    if (pinyin.includes(vowel)) {
      return pinyin.replace(vowel, marks[vowel]);
    }
  }
  
  return pinyin;
};

export const getToneSymbol = (toneId: number): string => {
  const tone = initialTones.find(t => t.id === toneId);
  return tone?.symbol || '';
};
