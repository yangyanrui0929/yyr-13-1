import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Root,
  Tone,
  Gesture,
  GrammarRule,
  Student,
  Sentence,
  Lesson,
  ClassRecord,
  ErrorCase,
  Progress,
  BuilderState,
  AppState,
} from '@/types';
import { initialRoots } from '@/data/roots';
import { initialTones } from '@/data/tones';
import { initialGestures } from '@/data/gestures';
import { initialGrammarRules } from '@/data/grammar';
import { initialStudents } from '@/data/students';
import { initialSentences } from '@/data/sentences';
import { generateId } from '@/utils/storage';

interface AppStore extends AppState {
  setRoots: (roots: Root[]) => void;
  addRoot: (root: Omit<Root, 'id'>) => void;
  updateRoot: (id: string, updates: Partial<Root>) => void;
  deleteRoot: (id: string) => void;
  
  addSentence: (sentence: Omit<Sentence, 'id' | 'createdAt'>) => void;
  updateSentence: (id: string, updates: Partial<Sentence>) => void;
  deleteSentence: (id: string) => void;
  
  addLesson: (lesson: Omit<Lesson, 'id' | 'createdAt'>) => void;
  updateLesson: (id: string, updates: Partial<Lesson>) => void;
  deleteLesson: (id: string) => void;
  
  addClassRecord: (record: Omit<ClassRecord, 'id' | 'timestamp'>) => void;
  
  addErrorCase: (errorCase: Omit<ErrorCase, 'id'>) => void;
  updateErrorCase: (id: string, updates: Partial<ErrorCase>) => void;
  
  updateProgress: (studentId: string, updates: Partial<Progress>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  
  setCurrentLesson: (lessonId: string | null) => void;
  setCurrentStudent: (studentId: string | null) => void;
  
  setBuilderState: (state: Partial<BuilderState>) => void;
  resetBuilderState: () => void;
  
  addRootToBuilder: (rootId: string) => void;
  removeRootFromBuilder: (index: number) => void;
  reorderRootsInBuilder: (fromIndex: number, toIndex: number) => void;
  
  setToneForRoot: (rootIndex: number, toneId: number) => void;
  
  addGestureToBuilder: (gestureId: string) => void;
  removeGestureFromBuilder: (gestureId: string) => void;
  
  resetAllData: () => void;
}

const initialProgress: Progress[] = initialStudents.map(student => ({
  id: `progress_${student.id}`,
  studentId: student.id,
  totalLessons: 0,
  completedLessons: 0,
  overallAccuracy: 0,
  masteredConcepts: [],
  currentObjectives: ['学习基础问候语', '掌握常用动词'],
  achievements: {},
}));

const initialLessons: Lesson[] = [
  {
    id: 'l1',
    title: '第一课：基础问候',
    description: '学习最基本的问候语和自我介绍',
    sentenceIds: ['s1', 's5'],
    targetStudentId: 's1',
    status: 'draft',
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'l2',
    title: '第二课：日常生活',
    description: '学习吃饭、喝水等日常动作表达',
    sentenceIds: ['s2', 's3'],
    targetStudentId: 's2',
    status: 'draft',
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'l3',
    title: '第三课：海底世界',
    description: '学习描述海洋生物和环境',
    sentenceIds: ['s4', 's6', 's8'],
    targetStudentId: 's3',
    status: 'draft',
    order: 3,
    createdAt: new Date().toISOString(),
  },
];

const initialErrorCases: ErrorCase[] = [
  {
    id: 'e1',
    pattern: '声调混淆',
    description: '学生经常混淆第三声和第二声',
    rootCause: '对降升调的感知能力较弱',
    correctionMethod: '用手势辅助展示声调变化，夸张地读出第三声',
    occurrenceCount: 5,
    relatedRecordIds: [],
  },
  {
    id: 'e2',
    pattern: '动词与名词颠倒',
    description: '学生经常把"吃饭"说成"饭吃"',
    rootCause: '母语语序影响，动词后置',
    correctionMethod: '反复练习主谓宾结构，用图片展示动作顺序',
    occurrenceCount: 3,
    relatedRecordIds: [],
  },
];

const initialClassRecords: ClassRecord[] = [];

const initialBuilderState: BuilderState = {
  selectedRoots: [],
  selectedTones: [],
  selectedGestures: [],
  previewSentence: '',
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      roots: initialRoots,
      tones: initialTones,
      gestures: initialGestures,
      grammarRules: initialGrammarRules,
      students: initialStudents,
      sentences: initialSentences,
      lessons: initialLessons,
      classRecords: initialClassRecords,
      errorCases: initialErrorCases,
      progress: initialProgress,
      currentLesson: null,
      currentStudent: null,
      builderState: initialBuilderState,

      setRoots: (roots) => set({ roots }),
      
      addRoot: (root) => set((state) => ({
        roots: [...state.roots, { ...root, id: generateId('r') }],
      })),
      
      updateRoot: (id, updates) => set((state) => ({
        roots: state.roots.map(r => r.id === id ? { ...r, ...updates } : r),
      })),
      
      deleteRoot: (id) => set((state) => ({
        roots: state.roots.filter(r => r.id !== id),
      })),

      addSentence: (sentence) => set((state) => ({
        sentences: [
          ...state.sentences,
          { ...sentence, id: generateId('s'), createdAt: new Date().toISOString() },
        ],
      })),
      
      updateSentence: (id, updates) => set((state) => ({
        sentences: state.sentences.map(s => s.id === id ? { ...s, ...updates } : s),
      })),
      
      deleteSentence: (id) => set((state) => ({
        sentences: state.sentences.filter(s => s.id !== id),
      })),

      addLesson: (lesson) => set((state) => ({
        lessons: [
          ...state.lessons,
          { ...lesson, id: generateId('l'), createdAt: new Date().toISOString() },
        ],
      })),
      
      updateLesson: (id, updates) => set((state) => ({
        lessons: state.lessons.map(l => l.id === id ? { ...l, ...updates } : l),
      })),
      
      deleteLesson: (id) => set((state) => ({
        lessons: state.lessons.filter(l => l.id !== id),
      })),

      addClassRecord: (record) => set((state) => ({
        classRecords: [
          ...state.classRecords,
          { ...record, id: generateId('cr'), timestamp: new Date().toISOString() },
        ],
      })),

      addErrorCase: (errorCase) => set((state) => ({
        errorCases: [...state.errorCases, { ...errorCase, id: generateId('e') }],
      })),
      
      updateErrorCase: (id, updates) => set((state) => ({
        errorCases: state.errorCases.map(e => e.id === id ? { ...e, ...updates } : e),
      })),

      updateProgress: (studentId, updates) => set((state) => ({
        progress: state.progress.map(p => 
          p.studentId === studentId ? { ...p, ...updates } : p
        ),
      })),
      
      updateStudent: (id, updates) => set((state) => ({
        students: state.students.map(s => s.id === id ? { ...s, ...updates } : s),
      })),

      setCurrentLesson: (lessonId) => set({ currentLesson: lessonId }),
      setCurrentStudent: (studentId) => set({ currentStudent: studentId }),

      setBuilderState: (state) => set((prev) => ({
        builderState: { ...prev.builderState, ...state },
      })),
      
      resetBuilderState: () => set({ builderState: initialBuilderState }),

      addRootToBuilder: (rootId) => set((state) => ({
        builderState: {
          ...state.builderState,
          selectedRoots: [...state.builderState.selectedRoots, rootId],
          selectedTones: [...state.builderState.selectedTones, 1],
        },
      })),
      
      removeRootFromBuilder: (index) => set((state) => ({
        builderState: {
          ...state.builderState,
          selectedRoots: state.builderState.selectedRoots.filter((_, i) => i !== index),
          selectedTones: state.builderState.selectedTones.filter((_, i) => i !== index),
        },
      })),
      
      reorderRootsInBuilder: (fromIndex, toIndex) => set((state) => {
        const newRoots = [...state.builderState.selectedRoots];
        const newTones = [...state.builderState.selectedTones];
        const [removedRoot] = newRoots.splice(fromIndex, 1);
        const [removedTone] = newTones.splice(fromIndex, 1);
        newRoots.splice(toIndex, 0, removedRoot);
        newTones.splice(toIndex, 0, removedTone);
        return {
          builderState: {
            ...state.builderState,
            selectedRoots: newRoots,
            selectedTones: newTones,
          },
        };
      }),

      setToneForRoot: (rootIndex, toneId) => set((state) => {
        const newTones = [...state.builderState.selectedTones];
        newTones[rootIndex] = toneId;
        return {
          builderState: {
            ...state.builderState,
            selectedTones: newTones,
          },
        };
      }),

      addGestureToBuilder: (gestureId) => set((state) => ({
        builderState: {
          ...state.builderState,
          selectedGestures: [...state.builderState.selectedGestures, gestureId],
        },
      })),
      
      removeGestureFromBuilder: (gestureId) => set((state) => ({
        builderState: {
          ...state.builderState,
          selectedGestures: state.builderState.selectedGestures.filter(id => id !== gestureId),
        },
      })),

      resetAllData: () => set({
        roots: initialRoots,
        tones: initialTones,
        gestures: initialGestures,
        grammarRules: initialGrammarRules,
        students: initialStudents,
        sentences: initialSentences,
        lessons: initialLessons,
        classRecords: initialClassRecords,
        errorCases: initialErrorCases,
        progress: initialProgress,
        currentLesson: null,
        currentStudent: null,
        builderState: initialBuilderState,
      }),
    }),
    {
      name: 'conch-language-academy-store',
      partialize: (state) => ({
        roots: state.roots,
        students: state.students,
        sentences: state.sentences,
        lessons: state.lessons,
        classRecords: state.classRecords,
        errorCases: state.errorCases,
        progress: state.progress,
      }),
    }
  )
);
