export type RootCategory = 'noun' | 'verb' | 'adjective' | 'adverb' | 'particle' | 'pronoun';

export interface Root {
  id: string;
  character: string;
  pinyin: string;
  meaning: string;
  category: RootCategory;
  difficulty: 1 | 2 | 3 | 4 | 5;
  examples: string[];
}

export interface Tone {
  id: number;
  name: string;
  symbol: string;
  description: string;
  pitchPattern: number[];
  color: string;
}

export interface Gesture {
  id: string;
  name: string;
  icon: string;
  description: string;
  associatedRoots: string[];
}

export interface GrammarRule {
  id: string;
  name: string;
  pattern: string;
  description: string;
  examples: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export type Personality = 'curious' | 'lazy' | 'eager' | 'shy' | 'playful';

export interface StudentAbilities {
  listening: number;
  comprehension: number;
  memory: number;
  attention: number;
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  personality: Personality;
  traits: string[];
  abilities: StudentAbilities;
  level: number;
  accuracy: number;
  masteredRoots: string[];
  weakRoots: string[];
  color: string;
}

export interface Sentence {
  id: string;
  rootIds: string[];
  tones: number[];
  gestureIds: string[];
  translation: string;
  expectedAction: string;
  createdAt: string;
}

export type LessonStatus = 'draft' | 'in_progress' | 'completed';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  sentenceIds: string[];
  targetStudentId: string;
  status: LessonStatus;
  order: number;
  createdAt: string;
}

export interface ClassRecord {
  id: string;
  lessonId: string;
  studentId: string;
  sentenceId: string;
  understood: boolean;
  misunderstanding: string;
  correction: string;
  attempts: number;
  timestamp: string;
}

export interface ErrorCase {
  id: string;
  pattern: string;
  description: string;
  rootCause: string;
  correctionMethod: string;
  occurrenceCount: number;
  relatedRecordIds: string[];
}

export interface Achievement {
  unlocked: boolean;
  unlockedAt: string;
}

export interface Progress {
  id: string;
  studentId: string;
  totalLessons: number;
  completedLessons: number;
  overallAccuracy: number;
  masteredConcepts: string[];
  currentObjectives: string[];
  achievements: Record<string, Achievement>;
}

export type ConchReaction = 'happy' | 'confused' | 'bored' | 'excited' | 'thinking' | 'surprised';

export interface UnderstandingResult {
  understood: boolean;
  confidence: number;
  misunderstanding: string;
  reaction: ConchReaction;
}

export interface MisunderstandingAnalysis {
  rootCause: string;
  mistakenRoot: string;
  correctionMethod: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  suggestions: string[];
}

export interface BuilderState {
  selectedRoots: string[];
  selectedTones: number[];
  selectedGestures: string[];
  previewSentence: string;
}

export interface AppState {
  roots: Root[];
  tones: Tone[];
  gestures: Gesture[];
  grammarRules: GrammarRule[];
  students: Student[];
  sentences: Sentence[];
  lessons: Lesson[];
  classRecords: ClassRecord[];
  errorCases: ErrorCase[];
  progress: Progress[];
  currentLesson: string | null;
  currentStudent: string | null;
  builderState: BuilderState;
}

export interface ProgressUpdateResult {
  updatedStudent: Student;
  updatedProgress: Progress;
  newAchievements: string[];
}
