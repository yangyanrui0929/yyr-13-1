import { useState, useCallback } from 'react';
import { Student, Sentence, Root, Tone, UnderstandingResult, MisunderstandingAnalysis } from '@/types';
import { calculateUnderstanding, analyzeMisunderstanding } from '@/utils/conchAI';
import { useAppStore } from '@/store';

export interface ProcessResult {
  result: UnderstandingResult;
  analysis: MisunderstandingAnalysis | null;
}

export const useConchAI = () => {
  const { roots, tones } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<UnderstandingResult | null>(null);
  const [lastAnalysis, setLastAnalysis] = useState<MisunderstandingAnalysis | null>(null);

  const processSentence = useCallback(async (
    student: Student,
    sentence: Sentence
  ): Promise<ProcessResult> => {
    setIsProcessing(true);
    setLastResult(null);
    setLastAnalysis(null);

    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const result = calculateUnderstanding(student, sentence, roots, tones);
    setLastResult(result);

    let analysis: MisunderstandingAnalysis | null = null;
    if (!result.understood) {
      analysis = analyzeMisunderstanding(student, sentence, roots);
      setLastAnalysis(analysis);
    }

    setIsProcessing(false);
    return { result, analysis };
  }, [roots, tones]);

  const getAnalysis = useCallback((
    student: Student,
    sentence: Sentence
  ): MisunderstandingAnalysis => {
    return analyzeMisunderstanding(student, sentence, roots);
  }, [roots]);

  const reset = useCallback(() => {
    setLastResult(null);
    setLastAnalysis(null);
  }, []);

  return {
    processSentence,
    getAnalysis,
    reset,
    isProcessing,
    lastResult,
    lastAnalysis,
  };
};
