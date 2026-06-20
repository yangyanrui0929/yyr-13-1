import { useState, useCallback, useEffect } from 'react';
import { speakText, stopSpeaking, isSpeaking } from '@/utils/speech';

interface SpeakOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: SpeechSynthesisErrorEvent) => void;
}

export const useSpeech = () => {
  const [isSpeakingState, setIsSpeakingState] = useState(false);
  const [currentText, setCurrentText] = useState<string | null>(null);
  const [waveform, setWaveform] = useState<number[]>([]);

  useEffect(() => {
    const checkSpeaking = () => {
      setIsSpeakingState(isSpeaking());
    };
    const interval = setInterval(checkSpeaking, 100);
    return () => clearInterval(interval);
  }, []);

  const speak = useCallback((text: string, options: SpeakOptions = {}) => {
    setCurrentText(text);
    setWaveform(Array.from({ length: 20 }, () => 0.3 + Math.random() * 0.7));
    
    const utterance = speakText(text, {
      ...options,
      onStart: () => {
        setIsSpeakingState(true);
        options.onStart?.();
      },
      onEnd: () => {
        setIsSpeakingState(false);
        setCurrentText(null);
        options.onEnd?.();
      },
      onError: (e) => {
        setIsSpeakingState(false);
        setCurrentText(null);
        options.onError?.(e);
      },
    });
    
    return utterance;
  }, []);

  const stop = useCallback(() => {
    stopSpeaking();
    setIsSpeakingState(false);
    setCurrentText(null);
  }, []);

  return {
    speak,
    stop,
    isSpeaking: isSpeakingState,
    currentText,
    waveform,
  };
};
