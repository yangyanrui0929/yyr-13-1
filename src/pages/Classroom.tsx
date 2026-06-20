import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  Send, 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  Users, 
  MessageSquare,
  Lightbulb,
  RefreshCw,
  History,
  Sparkles,
  AlertTriangle,
  Clock,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ConchAvatar } from '@/components/conch/ConchAvatar';
import { WaveDivider, BubbleBackground, FloatingElement } from '@/components/decorations/WaveDivider';
import { useAppStore } from '@/store';
import { useSpeech } from '@/hooks/useSpeech';
import { useConchAI } from '@/hooks/useConchAI';
import { getPersonalityLabel } from '@/data/students';
import { buildCharacters, buildPinyinWithTones } from '@/data/sentences';
import { applyToneToPinyin } from '@/data/tones';
import { getGestureIcon } from '@/data/gestures';
import { getReactionLabel, getReactionEmoji } from '@/utils/conchAI';
import { cn } from '@/lib/utils';
import { Student, Sentence, UnderstandingResult } from '@/types';

export const Classroom: React.FC = () => {
  const { students, sentences, roots, gestures, addClassRecord, classRecords } = useAppStore();
  const { speak, isSpeaking, waveform } = useSpeech();
  const { processSentence, isProcessing, lastResult, lastAnalysis, reset } = useConchAI();

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedSentence, setSelectedSentence] = useState<Sentence | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    reset();
    setAttempts(0);
    setShowCelebration(false);
  };

  const handleSelectSentence = (sentence: Sentence) => {
    setSelectedSentence(sentence);
    reset();
    setAttempts(0);
    setShowCelebration(false);
  };

  const handlePlayPronunciation = () => {
    if (selectedSentence) {
      const characters = buildCharacters(selectedSentence.rootIds, roots);
      speak(characters);
    }
  };

  const handleSendToStudent = async () => {
    if (!selectedStudent || !selectedSentence) return;

    setAttempts(prev => prev + 1);
    const result = await processSentence(selectedStudent, selectedSentence);

    addClassRecord({
      lessonId: 'classroom_' + Date.now(),
      studentId: selectedStudent.id,
      sentenceId: selectedSentence.id,
      understood: result.understood,
      misunderstanding: result.misunderstanding,
      correction: lastAnalysis?.correctionMethod || '',
      attempts: attempts + 1,
    });

    if (result.understood) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const handleReset = () => {
    reset();
    setAttempts(0);
    setShowCelebration(false);
  };

  const sentenceCharacters = useMemo(() => {
    if (!selectedSentence) return '';
    return buildCharacters(selectedSentence.rootIds, roots);
  }, [selectedSentence, roots]);

  const sentencePinyin = useMemo(() => {
    if (!selectedSentence) return '';
    return buildPinyinWithTones(
      selectedSentence.rootIds,
      selectedSentence.tones,
      roots,
      applyToneToPinyin
    );
  }, [selectedSentence, roots]);

  const sentenceGestures = useMemo(() => {
    if (!selectedSentence) return [];
    return selectedSentence.gestureIds.map(id => gestures.find(g => g.id === id)).filter(Boolean);
  }, [selectedSentence, gestures]);

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

  const celebrationVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: [0, 1.2, 1],
      opacity: 1,
      transition: {
        duration: 0.5,
        type: 'spring',
      },
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const confettiParticles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    color: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#9B59B6', '#74B9FF', '#FF9FF3'][Math.floor(Math.random() * 6)],
    delay: Math.random() * 0.5,
    size: 6 + Math.random() * 10,
  }));

  const recentRecords = useMemo(() => 
    classRecords
      .filter(r => selectedStudent ? r.studentId === selectedStudent.id : true)
      .slice(-5)
      .reverse(),
    [classRecords, selectedStudent]
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative min-h-screen">
      <BubbleBackground count={12} variant="dark" />

      <AnimatePresence>
        {showCelebration && (
          <motion.div
            variants={celebrationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <div className="relative w-full h-full">
              {confettiParticles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute rounded-full"
                  style={{
                    backgroundColor: particle.color,
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                  }}
                  initial={{ scale: 0, y: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1, 0.5, 0],
                    y: [0, -100 - Math.random() * 100, -200],
                    x: [0, (Math.random() - 0.5) * 100],
                    opacity: [1, 1, 0],
                    rotate: [0, Math.random() * 360],
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    delay: particle.delay,
                    ease: 'easeOut',
                  }}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="text-center bg-white/90 backdrop-blur-md rounded-3xl p-10 shadow-2xl"
                  animate={{
                    scale: [0, 1.2, 1],
                    rotate: [0, -5, 5, 0],
                  }}
                  transition={{ duration: 0.8 }}
                >
                  <Sparkles size={80} className="text-[var(--color-sand)] mx-auto mb-4 animate-pulse" />
                  <h2 className="text-4xl font-bold text-[var(--color-ocean-deep)] font-[var(--font-display)]">
                    太棒了！
                  </h2>
                  <p className="text-xl text-[var(--color-seaweed)] mt-2">
                    {selectedStudent?.name} 理解了！
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <span className="text-3xl">🎉</span>
                    <span className="text-3xl">🌟</span>
                    <span className="text-3xl">🐚</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-[var(--font-display)]">
            <span className="text-[var(--color-ocean-deep)]">互动</span>
            <span className="ml-3 bg-gradient-to-r from-[var(--color-coral)] via-[var(--color-sand)] to-[var(--color-seaweed)] bg-clip-text text-transparent">
              海螺课堂
            </span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            选择学生和句子，开始互动教学吧！
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card variant="ocean">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={24} className="text-[var(--color-ocean-mid)]" />
                  选择学生
                </CardTitle>
                <CardDescription>点击选择一位上课的学生</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {students.slice(0, 5).map((student, index) => (
                    <FloatingElement key={student.id} delay={index * 0.05}>
                      <motion.div
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectStudent(student)}
                        className={cn(
                          'p-3 rounded-xl cursor-pointer transition-all',
                          selectedStudent?.id === student.id
                            ? 'bg-[var(--color-ocean-mid)]/20 border-2 border-[var(--color-ocean-mid)] shadow-lg'
                            : 'bg-white/50 hover:bg-white/80 border-2 border-transparent'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <ConchAvatar
                            name={student.name}
                            avatar={student.avatar}
                            color={student.color}
                            size="sm"
                            showName={false}
                            animate={false}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[var(--color-ocean-deep)]">
                                {student.name}
                              </span>
                              <Badge variant="secondary" size="sm">
                                Lv.{student.level}
                              </Badge>
                            </div>
                            <p className="text-xs text-[var(--color-text-muted)]">
                              {getPersonalityLabel(student.personality)}
                            </p>
                            <div className="flex gap-1 mt-1">
                              {student.traits.slice(0, 2).map((trait, i) => (
                                <span key={i} className="text-[10px] text-[var(--color-text-secondary)]">
                                  {trait}
                                </span>
                              ))}
                            </div>
                          </div>
                          {selectedStudent?.id === student.id && (
                            <CheckCircle size={20} className="text-[var(--color-seaweed)]" />
                          )}
                        </div>
                      </motion.div>
                    </FloatingElement>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card variant="sand">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen size={24} className="text-[var(--color-sand)]" />
                  选择句式
                </CardTitle>
                <CardDescription>选择一个要教学的句子</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
                  {sentences.map((sentence, index) => {
                    const chars = buildCharacters(sentence.rootIds, roots);
                    const pinyin = buildPinyinWithTones(
                      sentence.rootIds,
                      sentence.tones,
                      roots,
                      applyToneToPinyin
                    );
                    return (
                      <motion.div
                        key={sentence.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectSentence(sentence)}
                        className={cn(
                          'p-4 rounded-xl cursor-pointer transition-all',
                          selectedSentence?.id === sentence.id
                            ? 'bg-[var(--color-sand)]/30 border-2 border-[var(--color-sand)] shadow-lg'
                            : 'bg-white/60 hover:bg-white/80 border-2 border-transparent'
                        )}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-2xl font-bold font-[var(--font-display)] text-[var(--color-ocean-deep)]">
                            {chars}
                          </p>
                          {selectedSentence?.id === sentence.id && (
                            <CheckCircle size={20} className="text-[var(--color-seaweed)] flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                          {pinyin}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] mb-2">
                          {sentence.translation}
                        </p>
                        <div className="flex items-center gap-1">
                          {sentence.gestureIds.slice(0, 3).map((gid) => {
                            const gesture = gestures.find(g => g.id === gid);
                            return gesture ? (
                              <span key={gid} className="text-lg" title={gesture.name}>
                                {gesture.icon}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                  {sentences.length === 0 && (
                    <div className="col-span-2 text-center py-8 text-[var(--color-text-muted)]">
                      <BookOpen size={40} className="mx-auto mb-2 opacity-50" />
                      <p>还没有保存的句式，去句式组合器创建吧！</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card variant="ocean">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare size={24} className="text-[var(--color-ocean-mid)]" />
                  互动课堂
                </CardTitle>
                <CardDescription>
                  {selectedStudent && selectedSentence 
                    ? `正在给 ${selectedStudent.name} 教学`
                    : '请先选择学生和句式'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col items-center">
                    {selectedStudent ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={selectedStudent.id}
                        className="relative"
                      >
                        <ConchAvatar
                          name={selectedStudent.name}
                          avatar={selectedStudent.avatar}
                          color={selectedStudent.color}
                          size="xl"
                          reaction={lastResult?.reaction || null}
                          isProcessing={isProcessing}
                          showName={true}
                          animate={true}
                        />
                        <AnimatePresence>
                          {lastResult && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-4 text-center"
                            >
                              <Badge 
                                variant={lastResult.understood ? 'seaweed' : 'coral'} 
                                size="lg"
                              >
                                {lastResult.understood ? '✓ 理解了' : '✗ 没理解'}
                              </Badge>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-48 h-48 rounded-full bg-[var(--color-foam)] flex items-center justify-center mb-4">
                          <span className="text-6xl opacity-40">🐚</span>
                        </div>
                        <p className="text-[var(--color-text-muted)]">请选择一位学生</p>
                      </div>
                    )}

                    <AnimatePresence>
                      {isSpeaking && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-6 w-full"
                        >
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Volume2 size={16} className="text-[var(--color-ocean-mid)] animate-pulse" />
                            <span className="text-sm text-[var(--color-text-secondary)]">正在播放...</span>
                          </div>
                          <div className="flex items-end justify-center gap-1 h-12">
                            {waveform.map((height, i) => (
                              <motion.div
                                key={i}
                                className="w-1.5 bg-gradient-to-t from-[var(--color-ocean-mid)] to-[var(--color-seaweed)] rounded-full"
                                animate={{ height: `${height * 100}%` }}
                                transition={{ duration: 0.1, delay: i * 0.02 }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-4">
                    {selectedSentence ? (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={selectedSentence.id}
                        className="space-y-4"
                      >
                        <div className="bg-gradient-to-br from-[var(--color-foam)] to-white rounded-2xl p-6 text-center border border-[var(--color-shallow-blue)]/20">
                          <p className="text-4xl md:text-5xl font-bold font-[var(--font-display)] text-[var(--color-ocean-deep)] mb-3">
                            {sentenceCharacters}
                          </p>
                          <p className="text-lg text-[var(--color-text-secondary)] mb-3">
                            {sentencePinyin}
                          </p>
                          <WaveDivider variant="ocean" height="sm" className="my-4" />
                          <p className="text-[var(--color-ocean-mid)] font-medium mb-2">
                            {selectedSentence.translation}
                          </p>
                          {sentenceGestures.length > 0 && (
                            <div className="flex items-center justify-center gap-2 mt-3">
                              <span className="text-sm text-[var(--color-text-muted)]">手势：</span>
                              {sentenceGestures.map((gesture) => (
                                <div key={gesture!.id} className="flex items-center gap-1">
                                  <span className="text-2xl" title={gesture!.name}>{gesture!.icon}</span>
                                  <span className="text-xs text-[var(--color-text-secondary)]">{gesture!.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="bg-white/60 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Target size={16} className="text-[var(--color-seaweed)]" />
                            <span className="text-sm font-medium text-[var(--color-ocean-deep)]">预期动作</span>
                          </div>
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            {selectedSentence.expectedAction}
                          </p>
                        </div>

                        {attempts > 0 && (
                          <div className="flex items-center justify-between bg-[var(--color-foam)] rounded-xl px-4 py-2">
                            <span className="text-sm text-[var(--color-text-secondary)]">尝试次数</span>
                            <Badge variant="primary">{attempts}</Badge>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full py-16">
                        <BookOpen size={60} className="text-[var(--color-foam)] mb-4" />
                        <p className="text-[var(--color-text-muted)]">请选择一个句式</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex flex-wrap gap-3 justify-center w-full">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handlePlayPronunciation}
                    disabled={!selectedSentence || isSpeaking}
                    leftIcon={<Volume2 size={20} />}
                  >
                    {isSpeaking ? '播放中...' : '播放发音'}
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSendToStudent}
                    disabled={!selectedStudent || !selectedSentence || isProcessing}
                    leftIcon={<Send size={20} />}
                    loading={isProcessing}
                  >
                    {isProcessing ? '发送中...' : '发送给学生'}
                  </Button>
                  <Button
                    variant="warning"
                    size="lg"
                    onClick={handleReset}
                    disabled={!lastResult && attempts === 0}
                    leftIcon={<RefreshCw size={20} />}
                  >
                    重试
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
            <Card variant={lastResult?.understood ? 'seaweed' : lastResult ? 'coral' : 'default'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {lastResult?.understood ? (
                    <CheckCircle size={24} className="text-[var(--color-seaweed)]" />
                  ) : lastResult ? (
                    <XCircle size={24} className="text-[var(--color-coral)]" />
                  ) : (
                    <AlertTriangle size={24} className="text-[var(--color-text-muted)]" />
                  )}
                  理解结果
                </CardTitle>
                <CardDescription>
                  {lastResult ? '学生的反馈' : '等待发送句子'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {lastResult ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={`${selectedStudent?.id}-${selectedSentence?.id}-${attempts}`}
                    className="space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--color-text-secondary)]">置信度</span>
                        <span className="text-sm font-bold text-[var(--color-ocean-deep)]">
                          {lastResult.confidence}%
                        </span>
                      </div>
                      <ProgressBar
                        value={lastResult.confidence}
                        variant={lastResult.understood ? 'seaweed' : 'coral'}
                        size="lg"
                        wave={true}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--color-text-secondary)]">表情反应</span>
                      <Badge variant={lastResult.understood ? 'seaweed' : 'coral'}>
                        <span className="mr-1">{getReactionEmoji(lastResult.reaction)}</span>
                        {getReactionLabel(lastResult.reaction)}
                      </Badge>
                    </div>

                    {!lastResult.understood && lastResult.misunderstanding && (
                      <div className="bg-[var(--color-coral)]/10 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle size={14} className="text-[var(--color-coral)]" />
                          <span className="text-sm font-medium text-[var(--color-coral)]">误解原因</span>
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {lastResult.misunderstanding}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="text-center py-8 text-[var(--color-text-muted)]">
                    <MessageSquare size={40} className="mx-auto mb-2 opacity-40" />
                    <p className="text-sm">发送句子后查看结果</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <AnimatePresence>
              {lastAnalysis && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card variant="sand">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb size={24} className="text-[var(--color-sand)]" />
                        误解分析
                      </CardTitle>
                      <CardDescription>AI 提供的教学建议</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-white/60 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle size={14} className="text-[var(--color-coral)]" />
                          <span className="text-sm font-medium text-[var(--color-ocean-deep)]">根本原因</span>
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {lastAnalysis.rootCause}
                        </p>
                      </div>

                      <div className="bg-[var(--color-seaweed)]/10 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Lightbulb size={14} className="text-[var(--color-seaweed)]" />
                          <span className="text-sm font-medium text-[var(--color-ocean-deep)]">纠正建议</span>
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {lastAnalysis.correctionMethod}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <Card variant="default">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History size={24} className="text-[var(--color-ocean-mid)]" />
                  近期记录
                </CardTitle>
                <CardDescription>
                  {selectedStudent ? `${selectedStudent.name}的课堂记录` : '全部课堂记录'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentRecords.length > 0 ? (
                  <div className="relative">
                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-[var(--color-foam)]" />
                    <div className="space-y-4">
                      {recentRecords.map((record, index) => {
                        const sentence = sentences.find(s => s.id === record.sentenceId);
                        const student = students.find(s => s.id === record.studentId);
                        const chars = sentence ? buildCharacters(sentence.rootIds, roots) : '已删除';
                        return (
                          <motion.div
                            key={record.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative pl-10"
                          >
                            <div className={cn(
                              'absolute left-2 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow',
                              record.understood 
                                ? 'bg-[var(--color-seaweed)]' 
                                : 'bg-[var(--color-coral)]'
                            )}>
                              {record.understood ? (
                                <CheckCircle size={12} className="text-white" />
                              ) : (
                                <XCircle size={12} className="text-white" />
                              )}
                            </div>
                            <div className="bg-white/60 rounded-xl p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-[var(--color-ocean-deep)]">
                                  {chars}
                                </span>
                                <Badge 
                                  variant={record.understood ? 'seaweed' : 'coral'} 
                                  size="sm"
                                >
                                  {record.understood ? '理解' : '未理解'}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                                <div className="flex items-center gap-1">
                                  {student && <span>{student.name}</span>}
                                  <span>·</span>
                                  <span>第{record.attempts}次</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock size={12} />
                                  <span>{formatTime(record.timestamp)}</span>
                                </div>
                              </div>
                              {record.misunderstanding && !record.understood && (
                                <p className="text-xs text-[var(--color-text-secondary)] mt-2 line-clamp-1">
                                  {record.misunderstanding}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-[var(--color-text-muted)]">
                    <History size={40} className="mx-auto mb-2 opacity-40" />
                    <p className="text-sm">还没有课堂记录</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
