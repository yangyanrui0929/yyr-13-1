import { GrammarRule } from '@/types';

export const initialGrammarRules: GrammarRule[] = [
  {
    id: 'gr1',
    name: '主语 + 谓语',
    pattern: '代词 + 动词',
    description: '基本的主谓结构，表达谁做什么',
    examples: ['你吃', '我喝', '鱼游'],
    difficulty: 1,
  },
  {
    id: 'gr2',
    name: '主语 + 谓语 + 宾语',
    pattern: '代词 + 动词 + 名词',
    description: '主谓宾结构，表达谁做什么事',
    examples: ['你吃饭', '我喝水', '小鱼游大海'],
    difficulty: 1,
  },
  {
    id: 'gr3',
    name: '定语 + 名词',
    pattern: '形容词 + 名词',
    description: '形容词修饰名词，表达事物的特征',
    examples: ['好饭', '大水', '美丽的贝壳'],
    difficulty: 1,
  },
  {
    id: 'gr4',
    name: '形容词 + 动词',
    pattern: '形容词 + 地 + 动词',
    description: '副词修饰动词，表达动作的方式',
    examples: ['快游', '慢吃', '开心地玩'],
    difficulty: 2,
  },
  {
    id: 'gr5',
    name: '是字句',
    pattern: '主语 + 是 + 宾语',
    description: '判断句，表达是什么',
    examples: ['我是老师', '你是朋友', '这是贝壳'],
    difficulty: 2,
  },
  {
    id: 'gr6',
    name: '把字句',
    pattern: '主语 + 把 + 宾语 + 动词',
    description: '处置式，强调对宾语的处置',
    examples: ['你把饭吃了', '我把水喝了'],
    difficulty: 3,
  },
  {
    id: 'gr7',
    name: '疑问句',
    pattern: '句子 + 吗/呢',
    description: '在句末加疑问助词构成疑问句',
    examples: ['你好吗？', '你吃饭了吗？'],
    difficulty: 2,
  },
  {
    id: 'gr8',
    name: '连动句',
    pattern: '主语 + 动词1 + 动词2',
    description: '连续发生的动作',
    examples: ['你去吃饭', '我来看海'],
    difficulty: 3,
  },
  {
    id: 'gr9',
    name: '很字句',
    pattern: '很 + 形容词',
    description: '程度副词修饰形容词',
    examples: ['很好', '很大', '很美丽'],
    difficulty: 1,
  },
  {
    id: 'gr10',
    name: '的字结构',
    pattern: '形容词/动词 + 的 + 名词',
    description: '用"的"连接修饰语和中心语',
    examples: ['我的朋友', '美丽的珊瑚', '吃的东西'],
    difficulty: 2,
  },
];

export const validateSentenceStructure = (
  rootIds: string[],
  roots: { id: string; category: string }[]
): { valid: boolean; matchedRule: GrammarRule | null; errors: string[] } => {
  if (rootIds.length === 0) {
    return { valid: false, matchedRule: null, errors: ['请至少选择一个词根'] };
  }

  const categories = rootIds.map(id => {
    const root = roots.find(r => r.id === id);
    return root?.category || 'unknown';
  });

  const pattern = categories.join(' + ');
  
  for (const rule of initialGrammarRules) {
    const ruleParts = rule.pattern.split(' + ');
    if (categories.length === ruleParts.length) {
      const matches = ruleParts.every((part, index) => {
        if (part === '代词') return categories[index] === 'pronoun';
        if (part === '名词') return categories[index] === 'noun';
        if (part === '动词') return categories[index] === 'verb';
        if (part === '形容词') return categories[index] === 'adjective';
        if (part === '副词') return categories[index] === 'adverb';
        if (part === '主语') return ['pronoun', 'noun'].includes(categories[index]);
        if (part === '宾语') return ['noun', 'pronoun'].includes(categories[index]);
        if (part === '谓语') return categories[index] === 'verb';
        if (part === '定语') return ['adjective', 'noun'].includes(categories[index]);
        return categories[index] === part.toLowerCase();
      });
      
      if (matches) {
        return { valid: true, matchedRule: rule, errors: [] };
      }
    }
  }

  const errors: string[] = [];
  
  if (categories[0] === 'verb') {
    errors.push('句子通常以名词或代词开头');
  }
  
  if (!categories.includes('verb') && !categories.includes('adjective')) {
    errors.push('句子需要包含动词或形容词');
  }
  
  if (categories.filter(c => c === 'noun').length === 0 && categories.filter(c => c === 'pronoun').length === 0) {
    errors.push('句子需要包含名词或代词');
  }

  if (errors.length === 0) {
    errors.push(`当前组合 "${pattern}" 不是标准句式，尝试调整顺序`);
  }

  return { valid: false, matchedRule: null, errors };
};
