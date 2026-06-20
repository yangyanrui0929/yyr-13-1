import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  Mic, 
  Search, 
  Settings, 
  Play,
  Music,
  Waves,
  ChevronDown,
  ChevronUp,
  BookOpen,
  MessageSquare,
  Gauge
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SearchInput, Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { BubbleBackground, FloatingElement } from '@/components/decorations/WaveDivider';
import { useAppStore } from '@/store';
import { useSpeech } from '@/hooks/useSpeech';
import { getCategoryLabel, getCategoryColor } from '@/data/roots';
import { applyToneToPinyin, getToneSymbol } from '@/data/tones';
import { buildCharacters, buildPinyinWithTones } from '@/data/sentences';
import { RootCategory, Tone, Root, Sentence } from '@/types';
import { cn } from '@/lib/utils';

const categories: { value: RootCategory | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'pronoun', label: '代词' },
  { value: 'noun', label: '名词' },
  { value: 'verb', label: '动词' },
  { value: 'adjective', label: '形容词' },
];

const toneExamples: Record<number, { pinyin: string; character: string }> = {
  1: { pinyin: 'mā', character: '妈' },
  2: { pinyin: 'má', character: '麻' },
  3: { pinyin: 'mǎ', character: '马' },
  4: { pinyin: 'mà', character: '骂' },
  5: { pinyin: 'ma', character: '吗' },
};

const ToneWaveform: React.FC<{ pitchPattern: number[]; color: string; active: boolean }> = ({ pitchPattern, color, active }) => {
  const bars = 15;
  const maxPitch = 5;
  
  return (
    <div className="flex items-end justify-center gap-0.5 h-16">
      {Array.from({ length: bars }, (_, i) => {
        const patternIndex = Math.floor((i / bars) * pitchPattern.length);
        const pitch = pitchPattern[patternIndex] || 3;
        const baseHeight = (pitch / maxPitch) * 100;
        return (
          <motion.div
            key={i}
            className="w-1.5 rounded-full"
            style={{ backgroundColor: color }}
            initial={{ height: '10%' }}
            animate={{ 
              height: active ? `${baseHeight + Math.random() * 20}%` : `${baseHeight * 0.4}%`,
              opacity: active ? 1 : 0.5
            }}
            transition={{ 
              duration: active ? 0.15 + Math.random() * 0.1 : 0.3,
              repeat: active ? Infinity : 0,
              repeatType: 'reverse',
            }}
          />
        );
      })}
    </div>
  );
};

const SpeakingWaveform: React.FC<{ waveform: number[]; color?: string }> = ({ waveform, color = 'var(--color-seaweed)' }) => {
  return (
    <div className="flex items-end justify-center gap-1 h-20">
      {waveform.map((height, i) => (
        <motion.div
          key={i}
          className="w-2 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ 
            height: `${Math.max(15, height * 100)}%`,
            opacity: 0.7 + height * 0.3
          }}
          transition={{ 
            duration: 0.1,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: i * 0.02
          }}
        />
      ))}
    </div>
  );
};

export const PronunciationLab: React.FC = () => {
  const { speak, isSpeaking, waveform, currentText } = useSpeech();
  const { tones, roots, sentences } = useAppStore();

  const [activeTone, setActiveTone] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RootCategory | 'all'>('all');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [playingItem, setPlayingItem] = useState<string | null>(null);

  const filteredRoots = useMemo(() => {
    return roots.filter(root => {
      const matchesSearch = root.character.includes(searchQuery) || 
        root.pinyin.includes(searchQuery) || 
        root.meaning.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || root.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [roots, searchQuery, selectedCategory]);

  const handleToneClick = (tone: Tone) => {
    setActiveTone(tone.id);
    setPlayingItem(`tone-${tone.id}`);
    const example = toneExamples[tone.id];
    if (example) {
      speak(example.character, { 
        rate, 
        pitch,
        onEnd: () => {
          setActiveTone(null);
          setPlayingItem(null);
        }
      });
    }
  };

  const handleRootClick = (root: Root) => {
    setPlayingItem(`root-${root.id}`);
    speak(root.character, { 
      rate, 
      pitch,
      onEnd: () => setPlayingItem(null)
    });
  };

  const handleSentenceClick = (sentence: Sentence) => {
    const characters = buildCharacters(sentence.rootIds, roots);
    setPlayingItem(`sentence-${sentence.id}`);
    speak(characters, { 
      rate, 
      pitch,
      onEnd: () => setPlayingItem(null)
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative min-h-screen">
      <BubbleBackground count={12} variant="dark" />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <span className="text-4xl">🎵</span>
                发音实验室
              </h1>
              <p className="text-[var(--color-text-secondary)]">
                练习声调、词根和句式，掌握正确的发音
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowSettings(!showSettings)}
                leftIcon={<Settings size={20} />}
                rightIcon={showSettings ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              >
                发音设置
              </Button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <Card variant="sand">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="flex items-center gap-2 font-medium text-[var(--color-ocean-deep)]">
                          <Gauge size={20} className="text-[var(--color-sand)]" />
                          语速调节
                        </label>
                        <Badge variant="sand" size="lg">
                          {rate.toFixed(1)}x
                        </Badge>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={rate}
                        onChange={(e) => setRate(parseFloat(e.target.value))}
                        className="w-full h-3 bg-[var(--color-foam)] rounded-full appearance-none cursor-pointer accent-[var(--color-sand)]"
                      />
                      <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-2">
                        <span>0.5x 慢速</span>
                        <span>1x 正常</span>
                        <span>2x 快速</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="flex items-center gap-2 font-medium text-[var(--color-ocean-deep)]">
                          <Music size={20} className="text-[var(--color-seaweed)]" />
                          音调调节
                        </label>
                        <Badge variant="seaweed" size="lg">
                          {pitch.toFixed(1)}x
                        </Badge>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={pitch}
                        onChange={(e) => setPitch(parseFloat(e.target.value))}
                        className="w-full h-3 bg-[var(--color-foam)] rounded-full appearance-none cursor-pointer accent-[var(--color-seaweed)]"
                      />
                      <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-2">
                        <span>0.5x 低沉</span>
                        <span>1x 正常</span>
                        <span>2x 高亢</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(isSpeaking || playingItem) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-8"
            >
              <Card variant="ocean">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <motion.div
                        animate={{ scale: isSpeaking ? [1, 1.1, 1] : 1 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-14 h-14 rounded-full bg-[var(--color-ocean-mid)]/20 flex items-center justify-center"
                      >
                        <Volume2 size={28} className="text-[var(--color-ocean-deep)]" />
                      </motion.div>
                      <div>
                        <p className="text-sm text-[var(--color-text-muted)]">正在播放</p>
                        <p className="text-2xl font-bold font-[var(--font-display)] text-[var(--color-ocean-deep)]">
                          {currentText || '发音中...'}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 min-w-[200px] max-w-md">
                      <SpeakingWaveform waveform={waveform.length > 0 ? waveform : Array.from({ length: 20 }, () => 0.5)} color="var(--color-ocean-mid)" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 space-y-6">
            <motion.div variants={itemVariants}>
              <Card variant="ocean">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Waves size={24} className="text-[var(--color-ocean-mid)]" />
                    声调练习
                  </CardTitle>
                  <CardDescription>点击声调卡片听发音，观察音调波形变化</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {tones.map((tone, index) => {
                      const example = toneExamples[tone.id];
                      const isActive = activeTone === tone.id;
                      return (
                        <FloatingElement key={tone.id} delay={index * 0.05}>
                          <motion.div
                            whileHover={{ y: -4, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleToneClick(tone)}
                            className={cn(
                              'relative cursor-pointer rounded-2xl p-5 text-center transition-all duration-300',
                              isActive 
                                ? 'ring-4 ring-offset-2 shadow-lg' 
                                : 'shadow-md hover:shadow-lg'
                            )}
                            style={{
                              backgroundColor: isActive ? `${tone.color}20` : 'white',
                              ringColor: tone.color,
                            }}
                          >
                            {isActive && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[var(--color-seaweed)] flex items-center justify-center"
                              >
                                <Volume2 size={14} className="text-white" />
                              </motion.div>
                            )}
                            
                            <div 
                              className="text-5xl font-bold font-[var(--font-display)] mb-2"
                              style={{ color: tone.color }}
                            >
                              {example?.character}
                            </div>
                            
                            <div className="text-lg text-[var(--color-text-secondary)] mb-1">
                              {example?.pinyin}
                            </div>
                            
                            <div className="flex items-center justify-center gap-1 mb-3">
                              <span 
                                className="text-2xl font-bold"
                                style={{ color: tone.color }}
                              >
                                {tone.symbol}
                              </span>
                              <Badge 
                                variant="secondary" 
                                size="sm"
                                style={{ backgroundColor: `${tone.color}20`, color: tone.color }}
                              >
                                {tone.name}
                              </Badge>
                            </div>
                            
                            <ToneWaveform 
                              pitchPattern={tone.pitchPattern} 
                              color={tone.color} 
                              active={isActive} 
                            />
                          </motion.div>
                        </FloatingElement>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 p-4 bg-[var(--color-foam)]/50 rounded-2xl">
                    <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                      <span className="font-medium text-[var(--color-ocean-deep)]">记忆口诀：</span>
                      一声高高平又平，二声就像上山坡，三声下坡又上坡，四声就像下山坡，轻声短短轻轻读。
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tones.map(tone => (
                        <Badge key={tone.id} variant="secondary" size="sm">
                          <span style={{ color: tone.color }} className="mr-1 font-bold">{tone.symbol}</span>
                          {tone.description.split('，')[0]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card variant="coral">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen size={24} className="text-[var(--color-coral)]" />
                        词根练习
                      </CardTitle>
                      <CardDescription>搜索并点击词根卡片听发音</CardDescription>
                    </div>
                    <Badge variant="coral" size="md">
                      {filteredRoots.length} 个词根
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <SearchInput
                      placeholder="搜索词根、拼音或含义..."
                      value={searchQuery}
                      onSearch={setSearchQuery}
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categories.map(cat => (
                      <button
                        key={cat.value}
                        onClick={() => setSelectedCategory(cat.value)}
                        className={cn(
                          'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                          selectedCategory === cat.value
                            ? 'bg-[var(--color-coral)] text-white shadow-md'
                            : 'bg-[var(--color-foam)] text-[var(--color-text-secondary)] hover:bg-[var(--color-shallow-blue)]/20'
                        )}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2">
                    {filteredRoots.map((root, index) => {
                      const isPlaying = playingItem === `root-${root.id}`;
                      return (
                        <motion.div
                          key={root.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.02 }}
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleRootClick(root)}
                          className={cn(
                            'relative cursor-pointer rounded-xl p-3 text-center transition-all duration-300 bg-white shadow-sm hover:shadow-md',
                            isPlaying && 'ring-2 ring-[var(--color-coral)] ring-offset-2'
                          )}
                        >
                          {isPlaying && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[var(--color-coral)] flex items-center justify-center"
                            >
                              <Play size={12} className="text-white fill-white" />
                            </motion.div>
                          )}
                          
                          <div className="text-3xl font-bold font-[var(--font-display)] text-[var(--color-ocean-deep)] mb-1">
                            {root.character}
                          </div>
                          
                          <div className="text-sm text-[var(--color-text-secondary)] mb-2">
                            {applyToneToPinyin(root.pinyin, 1)}
                          </div>
                          
                          <Badge 
                            variant="secondary" 
                            size="sm"
                            style={{ 
                              backgroundColor: `${getCategoryColor(root.category)}20`,
                              color: getCategoryColor(root.category)
                            }}
                          >
                            {getCategoryLabel(root.category)}
                          </Badge>
                          
                          <div className="text-xs text-[var(--color-text-muted)] mt-2">
                            {root.meaning}
                          </div>
                        </motion.div>
                      );
                    })}
                    {filteredRoots.length === 0 && (
                      <div className="col-span-full text-center py-8 text-[var(--color-text-muted)]">
                        <div className="text-4xl mb-2">🔍</div>
                        <p>没有找到匹配的词根</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <Card variant="seaweed">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare size={24} className="text-[var(--color-seaweed)]" />
                        句式练习
                      </CardTitle>
                      <CardDescription>点击句子卡片播放完整发音</CardDescription>
                    </div>
                    <Badge variant="seaweed" size="md">
                      {sentences.length} 个句子
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {sentences.map((sentence, index) => {
                      const characters = buildCharacters(sentence.rootIds, roots);
                      const pinyin = buildPinyinWithTones(
                        sentence.rootIds,
                        sentence.tones,
                        roots,
                        applyToneToPinyin
                      );
                      const isPlaying = playingItem === `sentence-${sentence.id}`;
                      
                      return (
                        <motion.div
                          key={sentence.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ x: 4 }}
                          onClick={() => handleSentenceClick(sentence)}
                          className={cn(
                            'cursor-pointer rounded-xl p-4 transition-all duration-300',
                            isPlaying 
                              ? 'bg-[var(--color-seaweed)]/20 ring-2 ring-[var(--color-seaweed)]' 
                              : 'bg-white/70 hover:bg-white shadow-sm hover:shadow-md'
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl font-bold font-[var(--font-display)] text-[var(--color-ocean-deep)]">
                                  {characters}
                                </span>
                                {isPlaying && (
                                  <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                  >
                                    <Volume2 size={16} className="text-[var(--color-seaweed)]" />
                                  </motion.div>
                                )}
                              </div>
                              <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                                {pinyin}
                              </p>
                              <p className="text-xs text-[var(--color-text-muted)]">
                                {sentence.translation}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1">
                              <Badge variant="seaweed" size="sm">
                                {sentence.rootIds.length}字
                              </Badge>
                            </div>
                          </div>
                          
                          {isPlaying && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-3"
                            >
                              <SpeakingWaveform 
                                waveform={waveform.length > 0 ? waveform : Array.from({ length: 15 }, () => 0.5)} 
                                color="var(--color-seaweed)" 
                              />
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                    {sentences.length === 0 && (
                      <div className="text-center py-8 text-[var(--color-text-muted)]">
                        <div className="text-4xl mb-2">📝</div>
                        <p>暂无句子，去句式组合器创建吧</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card variant="sand">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic size={24} className="text-[var(--color-sand)]" />
                    发音提示
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
                      <span className="text-2xl">👂</span>
                      <div>
                        <p className="text-sm font-medium text-[var(--color-ocean-deep)]">仔细听</p>
                        <p className="text-xs text-[var(--color-text-muted)]">先听标准发音，注意声调和节奏</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <p className="text-sm font-medium text-[var(--color-ocean-deep)]">慢模仿</p>
                        <p className="text-xs text-[var(--color-text-muted)]">调慢语速，跟着逐字跟读</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
                      <span className="text-2xl">🔄</span>
                      <div>
                        <p className="text-sm font-medium text-[var(--color-ocean-deep)]">反复练</p>
                        <p className="text-xs text-[var(--color-text-muted)]">多次重复练习，加深肌肉记忆</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
