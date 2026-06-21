import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Volume2, 
  Save, 
  RotateCcw, 
  Send,
  Filter,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SearchInput } from '@/components/ui/Input';
import { RootCard } from '@/components/builder/RootCard';
import { GestureCard } from '@/components/builder/GestureCard';
import { SentenceTrack } from '@/components/builder/SentenceTrack';
import { BubbleBackground } from '@/components/decorations/WaveDivider';
import { useAppStore } from '@/store';
import { useSpeech } from '@/hooks/useSpeech';
import { useGrammar } from '@/hooks/useGrammar';
import { getCategoryLabel, getCategoryColor } from '@/data/roots';
import { buildCharacters, buildPinyinWithTones } from '@/data/sentences';
import { applyToneToPinyin } from '@/data/tones';
import { RootCategory } from '@/types';
import { cn } from '@/lib/utils';

const categories: { value: RootCategory | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'pronoun', label: '代词' },
  { value: 'noun', label: '名词' },
  { value: 'verb', label: '动词' },
  { value: 'adjective', label: '形容词' },
];

export const SentenceBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { speak, isSpeaking, waveform } = useSpeech();
  const { validate, grammarRules } = useGrammar();
  
  const {
    roots,
    tones,
    gestures,
    students,
    builderState,
    addRootToBuilder,
    removeRootFromBuilder,
    reorderRootsInBuilder,
    setToneForRoot,
    addGestureToBuilder,
    removeGestureFromBuilder,
    resetBuilderState,
    addSentence,
    setCurrentLesson,
    currentStudent,
    setCurrentStudent,
    setCurrentSentence,
  } = useAppStore();

  useEffect(() => {
    if (!currentStudent && students.length > 0) {
      setCurrentStudent(students[0].id);
    }
  }, [currentStudent, students, setCurrentStudent]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RootCategory | 'all'>('all');
  const [translation, setTranslation] = useState('');
  const [expectedAction, setExpectedAction] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const selectedRootsData = useMemo(() => 
    builderState.selectedRoots.map(id => roots.find(r => r.id === id)).filter(Boolean),
    [builderState.selectedRoots, roots]
  );

  const filteredRoots = useMemo(() => {
    return roots.filter(root => {
      const matchesSearch = root.character.includes(searchQuery) || 
        root.pinyin.includes(searchQuery) || 
        root.meaning.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || root.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [roots, searchQuery, selectedCategory]);

  const validation = useMemo(() => 
    validate(builderState.selectedRoots),
    [validate, builderState.selectedRoots]
  );

  const handleSpeak = () => {
    if (selectedRootsData.length === 0) return;
    const characters = buildCharacters(builderState.selectedRoots, roots);
    speak(characters, { rate: 0.8 });
  };

  const handleSave = () => {
    if (!validation.valid || selectedRootsData.length === 0) return;
    
    const characters = buildCharacters(builderState.selectedRoots, roots);
    const pinyin = buildPinyinWithTones(
      builderState.selectedRoots,
      builderState.selectedTones,
      roots,
      applyToneToPinyin
    );
    
    addSentence({
      rootIds: builderState.selectedRoots,
      tones: builderState.selectedTones,
      gestureIds: builderState.selectedGestures,
      translation: translation || pinyin,
      expectedAction: expectedAction || `执行"${characters}"对应的动作`,
    });
    
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowSaveModal(false);
      resetBuilderState();
      setTranslation('');
      setExpectedAction('');
    }, 1500);
  };

  const handleSendToClassroom = () => {
    if (!validation.valid || selectedRootsData.length === 0) return;
    
    const characters = buildCharacters(builderState.selectedRoots, roots);
    const pinyin = buildPinyinWithTones(
      builderState.selectedRoots,
      builderState.selectedTones,
      roots,
      applyToneToPinyin
    );
    
    const sentenceId = addSentence({
      rootIds: builderState.selectedRoots,
      tones: builderState.selectedTones,
      gestureIds: builderState.selectedGestures,
      translation: translation || pinyin,
      expectedAction: expectedAction || `执行"${characters}"对应的动作`,
    });
    
    setCurrentSentence(sentenceId);
    
    if (currentStudent) {
      navigate('/classroom');
    } else {
      const targetStudent = students[0]?.id || null;
      setCurrentStudent(targetStudent);
      navigate('/classroom');
    }
  };

  const characters = buildCharacters(builderState.selectedRoots, roots);

  return (
    <div className="relative min-h-screen">
      <BubbleBackground count={8} variant="dark" />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <span className="text-4xl">🧩</span>
                句式组合器
              </h1>
              <p className="text-[var(--color-text-secondary)]">
                拖拽排列词根、声调和手势，组成完整的指令
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {students.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--color-text-muted)]">授课学生：</span>
                  <select
                    value={currentStudent || ''}
                    onChange={(e) => setCurrentStudent(e.target.value || null)}
                    className="px-4 py-2 rounded-full border-2 border-[var(--color-shallow-blue)]/30 bg-white text-sm focus:outline-none focus:border-[var(--color-ocean-mid)]"
                  >
                    <option value="">选择学生</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="ocean">
                <CardContent className="p-6">
                  <SentenceTrack
                    roots={selectedRootsData}
                    tones={builderState.selectedTones}
                    gestures={builderState.selectedGestures}
                    allRoots={roots}
                    allTones={tones}
                    allGestures={gestures}
                    onReorderRoots={reorderRootsInBuilder}
                    onRemoveRoot={removeRootFromBuilder}
                    onToneChange={setToneForRoot}
                    onRemoveGesture={removeGestureFromBuilder}
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant={validation.valid ? 'seaweed' : 'coral'}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
                      validation.valid ? 'bg-[var(--color-seaweed)]/20' : 'bg-[var(--color-coral)]/20'
                    )}>
                      {validation.valid ? (
                        <CheckCircle2 size={24} className="text-[var(--color-seaweed)]" />
                      ) : (
                        <AlertCircle size={24} className="text-[var(--color-coral)]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-2 text-[var(--color-ocean-deep)]">
                        {validation.valid ? '语法正确！' : '语法提示'}
                      </h4>
                      {validation.errors.length > 0 && (
                        <ul className="space-y-1 mb-3">
                          {validation.errors.map((error, i) => (
                            <li key={i} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                              <span className="text-[var(--color-coral)]">•</span>
                              {error}
                            </li>
                          ))}
                        </ul>
                      )}
                      {validation.suggestions.length > 0 && (
                        <div className="bg-white/50 rounded-xl p-3">
                          <p className="text-sm text-[var(--color-text-muted)] mb-2 flex items-center gap-2">
                            <Lightbulb size={16} className="text-[var(--color-sand)]" />
                            建议
                          </p>
                          <ul className="space-y-1">
                            {validation.suggestions.map((s, i) => (
                              <li key={i} className="text-sm text-[var(--color-text-secondary)]">
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Button
                variant="secondary"
                size="lg"
                onClick={handleSpeak}
                disabled={selectedRootsData.length === 0 || isSpeaking}
                leftIcon={<Volume2 size={20} />}
              >
                {isSpeaking ? '播放中...' : '播放发音'}
              </Button>
              
              <Button
                variant="warning"
                size="lg"
                onClick={resetBuilderState}
                leftIcon={<RotateCcw size={20} />}
              >
                重置
              </Button>
              
              <Button
                variant="success"
                size="lg"
                onClick={() => setShowSaveModal(true)}
                disabled={!validation.valid || selectedRootsData.length === 0}
                leftIcon={<Save size={20} />}
              >
                保存句式
              </Button>
              
              <Button
                variant="primary"
                size="lg"
                onClick={handleSendToClassroom}
                disabled={!validation.valid || selectedRootsData.length === 0 || !currentStudent}
                leftIcon={<Send size={20} />}
              >
                发送到课堂
              </Button>
            </motion.div>

            {isSpeaking && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[var(--color-ocean-deep)] rounded-2xl p-6 text-white"
              >
                <div className="flex items-center gap-4 mb-3">
                  <Volume2 size={24} className="animate-pulse" />
                  <span className="font-medium">正在播放：{characters}</span>
                </div>
                <div className="flex items-end justify-center gap-1 h-16">
                  {waveform.map((height, i) => (
                    <motion.div
                      key={i}
                      className="w-2 bg-[var(--color-seaweed)] rounded-full"
                      animate={{ height: `${height * 100}%` }}
                      transition={{ duration: 0.1, delay: i * 0.02 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="default">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">📚</span>
                    词根词库
                  </CardTitle>
                  <CardDescription>点击添加到组合轨道</CardDescription>
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
                          'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                          selectedCategory === cat.value
                            ? 'bg-[var(--color-ocean-deep)] text-white'
                            : 'bg-[var(--color-foam)] text-[var(--color-text-secondary)] hover:bg-[var(--color-shallow-blue)]/20'
                        )}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3">
                    {filteredRoots.map(root => (
                      <RootCard
                        key={root.id}
                        root={root}
                        selectable
                        selected={builderState.selectedRoots.includes(root.id)}
                        onClick={() => {
                          if (builderState.selectedRoots.includes(root.id)) {
                            const idx = builderState.selectedRoots.indexOf(root.id);
                            removeRootFromBuilder(idx);
                          } else {
                            addRootToBuilder(root.id);
                          }
                        }}
                      />
                    ))}
                    {filteredRoots.length === 0 && (
                      <div className="text-center py-8 text-[var(--color-text-muted)]">
                        <div className="text-4xl mb-2">🔍</div>
                        <p>没有找到匹配的词根</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="seaweed">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🤝</span>
                    手势库
                  </CardTitle>
                  <CardDescription>配合手势增强表达</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-3 max-h-[300px] overflow-y-auto">
                    {gestures.map(gesture => (
                      <GestureCard
                        key={gesture.id}
                        gesture={gesture}
                        size="sm"
                        selected={builderState.selectedGestures.includes(gesture.id)}
                        onClick={() => {
                          if (builderState.selectedGestures.includes(gesture.id)) {
                            removeGestureFromBuilder(gesture.id);
                          } else {
                            addGestureToBuilder(gesture.id);
                          }
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="sand">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles size={20} className="text-[var(--color-sand)]" />
                    语法规则
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {grammarRules.slice(0, 5).map(rule => (
                      <div 
                        key={rule.id}
                        className="p-3 rounded-xl bg-white/60 hover:bg-white transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm text-[var(--color-ocean-deep)]">
                            {rule.name}
                          </span>
                          <Badge variant="sand" size="sm">
                            Lv.{rule.difficulty}
                          </Badge>
                        </div>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                          {rule.pattern}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[var(--z-modal)] p-4"
            onClick={() => setShowSaveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                {saveSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full bg-[var(--color-seaweed)]/20 flex items-center justify-center mb-4">
                      <CheckCircle2 size={48} className="text-[var(--color-seaweed)]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--color-ocean-deep)] mb-2">
                      保存成功！
                    </h3>
                    <p className="text-[var(--color-text-secondary)]">
                      句式已添加到词库
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className="text-2xl font-bold text-[var(--color-ocean-deep)] mb-2">
                      保存句式
                    </h3>
                    <p className="text-[var(--color-text-secondary)] mb-6">
                      为这个句式添加翻译和预期动作
                    </p>
                    
                    <div className="mb-4 p-4 bg-[var(--color-foam)] rounded-xl">
                      <p className="text-2xl font-bold font-[var(--font-display)] text-center text-[var(--color-ocean-deep)]">
                        {characters}
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                          翻译（英文）
                        </label>
                        <input
                          type="text"
                          value={translation}
                          onChange={(e) => setTranslation(e.target.value)}
                          placeholder="e.g., Hello"
                          className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-shallow-blue)]/30 focus:border-[var(--color-ocean-mid)] focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                          预期动作
                        </label>
                        <textarea
                          value={expectedAction}
                          onChange={(e) => setExpectedAction(e.target.value)}
                          placeholder="描述海螺应该做出什么反应..."
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-shallow-blue)]/30 focus:border-[var(--color-ocean-mid)] focus:outline-none transition-colors resize-none"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                      <Button
                        variant="secondary"
                        fullWidth
                        onClick={() => setShowSaveModal(false)}
                      >
                        取消
                      </Button>
                      <Button
                        variant="success"
                        fullWidth
                        onClick={handleSave}
                      >
                        保存
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
