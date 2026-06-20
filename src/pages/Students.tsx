import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Award,
  Target,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Brain,
  Sparkles,
  AlertTriangle,
  Star,
  Trophy,
  Medal,
  Crown,
  Flame
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ConchAvatar } from '@/components/conch/ConchAvatar';
import { WaveDivider, BubbleBackground, FloatingElement } from '@/components/decorations/WaveDivider';
import { useAppStore } from '@/store';
import { getPersonalityLabel, getPersonalityDescription, getAbilityLabel } from '@/data/students';
import { Student, Root } from '@/types';

const abilityVariants: Record<keyof Student['abilities'], 'ocean' | 'coral' | 'seaweed' | 'sand'> = {
  listening: 'ocean',
  comprehension: 'coral',
  memory: 'seaweed',
  attention: 'sand',
};

const abilityIcons: Record<keyof Student['abilities'], React.ReactNode> = {
  listening: <span className="text-lg">👂</span>,
  comprehension: <span className="text-lg">🧠</span>,
  memory: <span className="text-lg">📚</span>,
  attention: <span className="text-lg">👁️</span>,
};

const achievementDefinitions = [
  { id: 'first_lesson', name: '初入课堂', icon: Star, description: '完成第一节课', color: 'var(--color-sand)' },
  { id: 'ten_roots', name: '词根小能手', icon: Medal, description: '掌握10个词根', color: 'var(--color-seaweed)' },
  { id: 'perfect_accuracy', name: '完美表现', icon: Trophy, description: '单节课正确率100%', color: 'var(--color-coral)' },
  { id: 'level_3', name: '进阶学员', icon: Crown, description: '达到等级3', color: 'var(--color-conch-purple)' },
  { id: 'five_lessons', name: '坚持不懈', icon: Flame, description: '完成5节课', color: 'var(--color-ocean-mid)' },
];

const getAchievementBadgeVariant = (unlocked: boolean): 'sand' | 'secondary' => {
  return unlocked ? 'sand' : 'secondary';
};

export const Students: React.FC = () => {
  const { students, progress, roots } = useAppStore();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(students[0]?.id || null);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  const selectedStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId) || null;
  }, [students, selectedStudentId]);

  const selectedStudentProgress = useMemo(() => {
    return progress.find(p => p.studentId === selectedStudentId) || null;
  }, [progress, selectedStudentId]);

  const getRootById = (rootId: string): Root | undefined => {
    return roots.find(r => r.id === rootId);
  };

  const getMasteredRoots = (student: Student): Root[] => {
    return student.masteredRoots.map(id => getRootById(id)).filter(Boolean) as Root[];
  };

  const getWeakRoots = (student: Student): Root[] => {
    return student.weakRoots.map(id => getRootById(id)).filter(Boolean) as Root[];
  };

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
  };

  const handleToggleExpand = (studentId: string) => {
    setExpandedStudentId(expandedStudentId === studentId ? null : studentId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const detailVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { height: 'auto', opacity: 1 },
  };

  return (
    <div className="relative min-h-screen">
      <BubbleBackground count={15} variant="dark" />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-[var(--font-display)]">
            <span className="text-[var(--color-ocean-deep)]">
              <Users className="inline-block mr-3 mb-1" size={40} />
              学生档案
            </span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            查看每位海螺学生的学习情况、能力特点和进步历程
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12"
        >
          {students.map((student, index) => (
            <motion.div key={student.id} variants={cardVariants}>
              <FloatingElement delay={index * 0.1}>
                <Card
                  hover
                  variant={selectedStudentId === student.id ? 'ocean' : 'default'}
                  className={`relative overflow-hidden h-full ${selectedStudentId === student.id ? 'ring-2 ring-[var(--color-ocean-mid)]' : ''}`}
                  onClick={() => handleSelectStudent(student.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <ConchAvatar
                        name={student.name}
                        avatar={student.avatar}
                        color={student.color}
                        size="lg"
                        animate={false}
                      />
                      
                      <div className="mt-4 flex items-center gap-2">
                        <Badge variant="primary" size="md">
                          Lv.{student.level}
                        </Badge>
                        <Badge variant={getPersonalityLabel(student.personality).includes('好奇') ? 'seaweed' : getPersonalityLabel(student.personality).includes('懒散') ? 'sand' : getPersonalityLabel(student.personality).includes('急切') ? 'coral' : getPersonalityLabel(student.personality).includes('害羞') ? 'purple' : 'secondary'} size="md">
                          {getPersonalityLabel(student.personality)}
                        </Badge>
                      </div>

                      <div className="w-full mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[var(--color-text-secondary)]">正确率</span>
                          <span className="font-bold text-[var(--color-ocean-deep)]">{Math.round(student.accuracy * 100)}%</span>
                        </div>
                        <ProgressBar
                          value={student.accuracy * 100}
                          size="sm"
                          variant="seaweed"
                          showLabel={false}
                        />
                      </div>

                      <div className="w-full mt-4 grid grid-cols-2 gap-2 text-center">
                        <div className="p-2 rounded-xl bg-[var(--color-seaweed)]/10">
                          <p className="text-xs text-[var(--color-text-muted)]">已掌握</p>
                          <p className="text-lg font-bold text-[var(--color-seaweed)]">{student.masteredRoots.length}</p>
                        </div>
                        <div className="p-2 rounded-xl bg-[var(--color-coral)]/10">
                          <p className="text-xs text-[var(--color-text-muted)]">需加强</p>
                          <p className="text-lg font-bold text-[var(--color-coral)]">{student.weakRoots.length}</p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-4 w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleExpand(student.id);
                        }}
                        rightIcon={expandedStudentId === student.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      >
                        {expandedStudentId === student.id ? '收起详情' : '查看详情'}
                      </Button>
                    </div>

                    <AnimatePresence>
                      {expandedStudentId === student.id && (
                        <motion.div
                          initial="collapsed"
                          animate="expanded"
                          exit="collapsed"
                          variants={detailVariants}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-[var(--color-foam)]">
                            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                              {getPersonalityDescription(student.personality)}
                            </p>
                            
                            <div className="mt-4">
                              <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2">性格特点</p>
                              <div className="flex flex-wrap gap-1">
                                {student.traits.map((trait, i) => (
                                  <span key={i} className="text-xs px-2 py-1 rounded-full bg-[var(--color-shallow-blue)]/20 text-[var(--color-ocean-deep)]">
                                    {trait}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </FloatingElement>
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedStudent && (
            <motion.div
              key={selectedStudent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2 space-y-6">
                <Card variant="glass">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Brain size={24} className="text-[var(--color-ocean-mid)]" />
                          能力分析
                        </CardTitle>
                        <CardDescription>{selectedStudent.name}的四项核心能力</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-5">
                      {(Object.keys(selectedStudent.abilities) as Array<keyof Student['abilities']>).map((ability) => (
                        <div key={ability as string}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {abilityIcons[ability]}
                              <span className="font-medium text-[var(--color-text-secondary)]">
                                {getAbilityLabel(ability)}
                              </span>
                            </div>
                            <span className="font-bold text-lg" style={{ color: `var(--color-${abilityVariants[ability]})` }}>
                              {selectedStudent.abilities[ability]}
                            </span>
                          </div>
                          <ProgressBar
                            value={selectedStudent.abilities[ability]}
                            variant={abilityVariants[ability]}
                            size="lg"
                            showLabel={false}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card variant="ocean">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles size={22} className="text-[var(--color-seaweed)]" />
                        已掌握词根
                        <Badge variant="seaweed" size="sm">
                          {getMasteredRoots(selectedStudent).length}个
                        </Badge>
                      </CardTitle>
                      <CardDescription>已熟练掌握的汉语词根</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {getMasteredRoots(selectedStudent).length === 0 ? (
                        <p className="text-center py-6 text-[var(--color-text-muted)]">
                          暂无已掌握的词根
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                          {getMasteredRoots(selectedStudent).map((root) => (
                            <motion.div
                              key={root.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center justify-between p-3 rounded-xl bg-white/60 hover:bg-white transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-[var(--color-ocean-deep)]">
                                  {root.character}
                                </span>
                                <span className="text-sm text-[var(--color-text-secondary)]">
                                  {root.pinyin}
                                </span>
                              </div>
                              <Badge variant="seaweed" size="sm">
                                {root.meaning}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card variant="coral">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle size={22} className="text-[var(--color-coral)]" />
                        薄弱词根
                        <Badge variant="coral" size="sm">
                          {getWeakRoots(selectedStudent).length}个
                        </Badge>
                      </CardTitle>
                      <CardDescription>需要加强练习的词根</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {getWeakRoots(selectedStudent).length === 0 ? (
                        <p className="text-center py-6 text-[var(--color-text-muted)]">
                          太棒了，没有薄弱词根！
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                          {getWeakRoots(selectedStudent).map((root) => (
                            <motion.div
                              key={root.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center justify-between p-3 rounded-xl bg-white/60 hover:bg-white transition-colors border border-[var(--color-coral)]/20"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-[var(--color-ocean-deep)]">
                                  {root.character}
                                </span>
                                <span className="text-sm text-[var(--color-text-secondary)]">
                                  {root.pinyin}
                                </span>
                              </div>
                              <Badge variant="coral" size="sm">
                                需练习
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-6">
                <Card variant="sand">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target size={24} className="text-[var(--color-sand)]" />
                      学习概况
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[var(--color-seaweed)]/20 flex items-center justify-center">
                          <Sparkles size={22} className="text-[var(--color-seaweed)]" />
                        </div>
                        <div>
                          <p className="text-sm text-[var(--color-text-muted)]">已掌握词根</p>
                          <p className="text-2xl font-bold text-[var(--color-ocean-deep)]">
                            {getMasteredRoots(selectedStudent).length}
                            <span className="text-sm font-normal ml-1 text-[var(--color-text-muted)]">个</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[var(--color-coral)]/20 flex items-center justify-center">
                          <AlertTriangle size={22} className="text-[var(--color-coral)]" />
                        </div>
                        <div>
                          <p className="text-sm text-[var(--color-text-muted)]">薄弱词根</p>
                          <p className="text-2xl font-bold text-[var(--color-ocean-deep)]">
                            {getWeakRoots(selectedStudent).length}
                            <span className="text-sm font-normal ml-1 text-[var(--color-text-muted)]">个</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-[var(--color-text-secondary)] flex items-center gap-2">
                          <TrendingUp size={18} />
                          整体正确率
                        </span>
                        <span className="font-bold text-lg text-[var(--color-ocean-deep)]">
                          {Math.round(selectedStudent.accuracy * 100)}%
                        </span>
                      </div>
                      <ProgressBar
                        value={selectedStudent.accuracy * 100}
                        variant="seaweed"
                        size="lg"
                      />
                    </div>

                    {selectedStudentProgress && (
                      <>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-[var(--color-text-secondary)]">
                              课程进度
                            </span>
                            <span className="font-bold text-[var(--color-ocean-deep)]">
                              {selectedStudentProgress.completedLessons}/{selectedStudentProgress.totalLessons || 0}
                            </span>
                          </div>
                          <ProgressBar
                            value={selectedStudentProgress.totalLessons > 0 ? (selectedStudentProgress.completedLessons / selectedStudentProgress.totalLessons) * 100 : 0}
                            variant="ocean"
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card variant="default">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award size={24} className="text-[var(--color-conch-purple)]" />
                      成就徽章
                    </CardTitle>
                    <CardDescription>
                      {selectedStudentProgress
                        ? `已解锁 ${Object.values(selectedStudentProgress.achievements).filter((a: any) => a.unlocked).length}/${achievementDefinitions.length} 个成就`
                        : `共 ${achievementDefinitions.length} 个成就可解锁`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {achievementDefinitions.map((achievement, index) => {
                        const unlocked = selectedStudentProgress?.achievements[achievement.id]?.unlocked || false;
                        return (
                          <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className={`relative p-4 rounded-2xl text-center transition-all duration-300 ${unlocked ? 'bg-gradient-to-br from-[var(--color-sand)]/30 to-[var(--color-sand)]/10 border-2 border-[var(--color-sand)]/40' : 'bg-[var(--color-foam)]/50 border-2 border-dashed border-[var(--color-shallow-blue)]/30 opacity-60'}`}
                          >
                            <div
                              className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${unlocked ? '' : 'grayscale'}`}
                              style={{
                                backgroundColor: unlocked ? `${achievement.color}30` : 'var(--color-foam)',
                              }}
                            >
                              <achievement.icon
                                size={24}
                                style={{ color: unlocked ? achievement.color : 'var(--color-text-muted)' }}
                              />
                            </div>
                            <p className={`text-sm font-bold ${unlocked ? 'text-[var(--color-ocean-deep)]' : 'text-[var(--color-text-muted)]'}`}>
                              {achievement.name}
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)] mt-1">
                              {achievement.description}
                            </p>
                            {unlocked && (
                              <Badge variant={getAchievementBadgeVariant(unlocked)} size="sm" className="mt-2">
                                已解锁
                              </Badge>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs text-[var(--color-text-muted)] text-center w-full">
                      完成更多课程和任务来解锁新成就吧！
                    </p>
                  </CardFooter>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <WaveDivider variant="ocean" height="lg" className="mt-16" />
    </div>
  );
};
