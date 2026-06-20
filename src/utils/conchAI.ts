import {
  Student,
  Sentence,
  Root,
  UnderstandingResult,
  MisunderstandingAnalysis,
  ProgressUpdateResult,
  Progress,
  ClassRecord,
  ConchReaction,
} from '@/types';

const misunderstandingTemplates = [
  '把"{root1}"听成了"{root2}"',
  '混淆了声调，把第{tone1}声听成了第{tone2}声',
  '没有理解手势{gesture}的含义',
  '以为是在说别的事情',
  '注意力不集中，没听清',
  '对"{root}"这个词还不熟悉',
  '语法结构太复杂了',
];

const correctionTemplates = [
  '放慢语速，重读"{root}"',
  '夸张地做出{gesture}手势',
  '用更简单的词替换"{root}"',
  '先单独教"{root}"这个词',
  '结合图片或实物来解释',
  '分解句子，逐词教学',
  '重复几次，让学生慢慢理解',
];

export const calculateUnderstanding = (
  student: Student,
  sentence: Sentence,
  roots: Root[],
  tones: { id: number; name: string }[]
): UnderstandingResult => {
  const sentenceRoots = sentence.rootIds.map(id => roots.find(r => r.id === id)).filter(Boolean) as Root[];
  
  let baseProbability = 0.5;
  
  baseProbability += (student.abilities.comprehension - 50) / 200;
  baseProbability += (student.abilities.listening - 50) / 200;
  baseProbability += (student.abilities.attention - 50) / 200;
  
  const masteredCount = sentenceRoots.filter(r => 
    student.masteredRoots.includes(r.id)
  ).length;
  const weakCount = sentenceRoots.filter(r => 
    student.weakRoots.includes(r.id)
  ).length;
  
  baseProbability += (masteredCount / sentenceRoots.length) * 0.3;
  baseProbability -= (weakCount / sentenceRoots.length) * 0.2;
  
  const avgDifficulty = sentenceRoots.reduce((sum, r) => sum + r.difficulty, 0) / sentenceRoots.length;
  baseProbability -= (avgDifficulty - 2) * 0.1;
  
  switch (student.personality) {
    case 'curious':
      baseProbability += 0.05;
      break;
    case 'lazy':
      baseProbability -= 0.1;
      break;
    case 'eager':
      baseProbability += 0.03;
      break;
    case 'shy':
      baseProbability -= 0.05;
      break;
    case 'playful':
      baseProbability -= 0.08;
      break;
  }
  
  baseProbability = Math.max(0.1, Math.min(0.95, baseProbability));
  
  const randomFactor = Math.random();
  const understood = randomFactor < baseProbability;
  
  const confidence = Math.round(baseProbability * 100);
  
  let reaction: ConchReaction;
  let misunderstanding = '';
  
  if (understood) {
    const reactions: ConchReaction[] = ['happy', 'excited'];
    reaction = reactions[Math.floor(Math.random() * reactions.length)];
  } else {
    if (randomFactor < baseProbability + 0.2) {
      reaction = 'thinking';
      misunderstanding = generateMisunderstanding(sentenceRoots, sentence.tones, tones);
    } else if (randomFactor < baseProbability + 0.4) {
      reaction = 'surprised';
      misunderstanding = generateMisunderstanding(sentenceRoots, sentence.tones, tones);
    } else if (student.personality === 'lazy' || student.personality === 'playful') {
      reaction = 'bored';
      misunderstanding = '注意力不集中，在想别的事情';
    } else {
      reaction = 'confused';
      misunderstanding = generateMisunderstanding(sentenceRoots, sentence.tones, tones);
    }
  }
  
  return {
    understood,
    confidence,
    misunderstanding,
    reaction,
  };
};

const generateMisunderstanding = (
  roots: Root[],
  toneIds: number[],
  tones: { id: number; name: string }[]
): string => {
  const template = misunderstandingTemplates[Math.floor(Math.random() * misunderstandingTemplates.length)];
  
  let result = template;
  
  if (result.includes('{root1}') && result.includes('{root2}')) {
    const root1 = roots[Math.floor(Math.random() * roots.length)];
    const root2 = roots[Math.floor(Math.random() * roots.length)];
    result = result.replace('{root1}', root1?.character || '词');
    result = result.replace('{root2}', root2?.character || '另一个词');
  } else if (result.includes('{root}')) {
    const root = roots[Math.floor(Math.random() * roots.length)];
    result = result.replace('{root}', root?.character || '这个词');
  }
  
  if (result.includes('{tone1}') && result.includes('{tone2}')) {
    const tone1 = toneIds[Math.floor(Math.random() * toneIds.length)] || 1;
    const tone2 = toneIds[Math.floor(Math.random() * toneIds.length)] || 2;
    result = result.replace('{tone1}', tone1.toString());
    result = result.replace('{tone2}', tone2.toString());
  }
  
  if (result.includes('{gesture}')) {
    const gestures = ['招手', '指向', '点头', '摇头', '手势'];
    result = result.replace('{gesture}', gestures[Math.floor(Math.random() * gestures.length)]);
  }
  
  return result;
};

export const analyzeMisunderstanding = (
  student: Student,
  sentence: Sentence,
  roots: Root[]
): MisunderstandingAnalysis => {
  const sentenceRoots = sentence.rootIds.map(id => roots.find(r => r.id === id)).filter(Boolean) as Root[];
  
  const possibleWeakRoots = sentenceRoots.filter(r => 
    student.weakRoots.includes(r.id) || !student.masteredRoots.includes(r.id)
  );
  
  const mistakenRoot = possibleWeakRoots.length > 0
    ? possibleWeakRoots[Math.floor(Math.random() * possibleWeakRoots.length)]
    : sentenceRoots[Math.floor(Math.random() * sentenceRoots.length)];
  
  const rootCauseOptions = [
    `对"${mistakenRoot?.character}"这个词根的含义理解不透彻`,
    `声调辨析能力需要加强`,
    `手势与语义的关联还不熟悉`,
    `句子结构太复杂，需要拆分练习`,
    `缺乏足够的重复练习`,
  ];
  
  const rootCause = rootCauseOptions[Math.floor(Math.random() * rootCauseOptions.length)];
  
  const correctionMethod = correctionTemplates[Math.floor(Math.random() * correctionTemplates.length)]
    .replace('{root}', mistakenRoot?.character || '这个词')
    .replace('{gesture}', '相应的');
  
  return {
    rootCause,
    mistakenRoot: mistakenRoot?.id || '',
    correctionMethod,
  };
};

export const updateProgress = (
  student: Student,
  record: ClassRecord,
  currentProgress: Progress,
  sentence: Sentence,
  roots: Root[]
): ProgressUpdateResult => {
  const updatedStudent = { ...student };
  const updatedProgress = { ...currentProgress };
  const newAchievements: string[] = [];
  
  const totalRecords = updatedProgress.totalLessons;
  const correctRecords = Math.round(updatedProgress.overallAccuracy * totalRecords);
  
  const newTotal = totalRecords + 1;
  const newCorrect = correctRecords + (record.understood ? 1 : 0);
  updatedProgress.overallAccuracy = newCorrect / newTotal;
  
  if (record.understood) {
    const sentenceRoots = sentence.rootIds;
    sentenceRoots.forEach(rootId => {
      if (!updatedStudent.masteredRoots.includes(rootId)) {
        const root = roots.find(r => r.id === rootId);
        if (root) {
          const recordsForRoot = 1;
          if (recordsForRoot >= 3) {
            updatedStudent.masteredRoots.push(rootId);
            updatedProgress.masteredConcepts.push(root.character);
            newAchievements.push(`掌握了"${root.character}"`);
          }
        }
      }
      
      if (updatedStudent.weakRoots.includes(rootId) && Math.random() > 0.5) {
        updatedStudent.weakRoots = updatedStudent.weakRoots.filter(id => id !== rootId);
      }
    });
    
    const abilityIncrease = 0.5;
    updatedStudent.abilities.listening = Math.min(100, updatedStudent.abilities.listening + abilityIncrease);
    updatedStudent.abilities.comprehension = Math.min(100, updatedStudent.abilities.comprehension + abilityIncrease);
    updatedStudent.abilities.memory = Math.min(100, updatedStudent.abilities.memory + abilityIncrease * 0.5);
  } else {
    const sentenceRoots = sentence.rootIds;
    sentenceRoots.forEach(rootId => {
      if (!updatedStudent.weakRoots.includes(rootId) && !updatedStudent.masteredRoots.includes(rootId)) {
        if (Math.random() > 0.7) {
          updatedStudent.weakRoots.push(rootId);
        }
      }
    });
  }
  
  updatedStudent.accuracy = updatedProgress.overallAccuracy;
  
  const newLevel = Math.floor(updatedStudent.masteredRoots.length / 5) + 1;
  if (newLevel > updatedStudent.level) {
    updatedStudent.level = newLevel;
    newAchievements.push(`升到了${newLevel}级`);
  }
  
  const achievementDefs = [
    { id: 'first_lesson', condition: () => updatedProgress.totalLessons === 1, name: '第一堂课' },
    { id: 'ten_lessons', condition: () => updatedProgress.totalLessons === 10, name: '十堂课' },
    { id: 'fifty_lessons', condition: () => updatedProgress.totalLessons === 50, name: '教学达人' },
    { id: 'perfect_score', condition: () => updatedProgress.overallAccuracy >= 0.9 && updatedProgress.totalLessons >= 5, name: '满分老师' },
    { id: 'root_master', condition: () => updatedStudent.masteredRoots.length >= 10, name: '词根大师' },
  ];
  
  achievementDefs.forEach(achievement => {
    if (achievement.condition() && !updatedProgress.achievements[achievement.id]?.unlocked) {
      updatedProgress.achievements[achievement.id] = {
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      };
      newAchievements.push(`解锁成就：${achievement.name}`);
    }
  });
  
  updatedProgress.totalLessons = newTotal;
  if (record.understood) {
    updatedProgress.completedLessons++;
  }
  
  return {
    updatedStudent,
    updatedProgress,
    newAchievements,
  };
};

export const getReactionEmoji = (reaction: ConchReaction): string => {
  const emojis: Record<ConchReaction, string> = {
    happy: '😊',
    confused: '😕',
    bored: '😴',
    excited: '🎉',
    thinking: '🤔',
    surprised: '😮',
  };
  return emojis[reaction] || '🐚';
};

export const getReactionLabel = (reaction: ConchReaction): string => {
  const labels: Record<ConchReaction, string> = {
    happy: '开心',
    confused: '困惑',
    bored: '无聊',
    excited: '兴奋',
    thinking: '思考',
    surprised: '惊讶',
  };
  return labels[reaction] || '反应';
};
