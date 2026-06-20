export const speakText = (
  text: string,
  options: {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: SpeechSynthesisErrorEvent) => void;
  } = {}
): SpeechSynthesisUtterance | null => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return null;
  }
  
  const {
    lang = 'zh-CN',
    rate = 1,
    pitch = 1,
    volume = 1,
    onStart,
    onEnd,
    onError,
  } = options;
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;
  
  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  if (onError) utterance.onerror = onError;
  
  window.speechSynthesis.speak(utterance);
  
  return utterance;
};

export const stopSpeaking = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const pauseSpeaking = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
};

export const resumeSpeaking = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
};

export const isSpeaking = (): boolean => {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
};

export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if (!('speechSynthesis' in window)) {
    return [];
  }
  return window.speechSynthesis.getVoices();
};

export const getChineseVoices = (): SpeechSynthesisVoice[] => {
  return getAvailableVoices().filter(voice => 
    voice.lang.startsWith('zh')
  );
};

export const speakWithVoice = (
  text: string,
  voiceName: string,
  options: Omit<Parameters<typeof speakText>[1], 'voice'> = {}
): SpeechSynthesisUtterance | null => {
  const voices = getAvailableVoices();
  const voice = voices.find(v => v.name === voiceName);
  
  const utterance = speakText(text, options);
  if (utterance && voice) {
    utterance.voice = voice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
  
  return utterance;
};

export const generateAudioWaveform = (duration: number, bars: number = 20): number[] => {
  const waveform: number[] = [];
  for (let i = 0; i < bars; i++) {
    const baseHeight = 0.3 + Math.random() * 0.7;
    const waveEffect = Math.sin((i / bars) * Math.PI * 2) * 0.2;
    waveform.push(Math.max(0.1, Math.min(1, baseHeight + waveEffect)));
  }
  return waveform;
};

export const getTonePitchPattern = (toneId: number): number[] => {
  const patterns: Record<number, number[]> = {
    1: [5, 5, 5, 5, 5],
    2: [3, 4, 4, 5, 5],
    3: [2, 1, 2, 3, 4],
    4: [5, 4, 3, 2, 1],
    5: [2, 2, 2, 2, 2],
  };
  return patterns[toneId] || [3, 3, 3, 3, 3];
};

export const formatPinyinForSpeech = (
  characters: string,
  pinyin: string,
  tones: number[]
): string => {
  return characters;
};
