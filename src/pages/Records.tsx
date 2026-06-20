import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award,
  Clock,
  Filter,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Trophy,
  Lock,
  Star,
  ChevronDown,
  ListTodo,
  Repeat,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SearchInput } from '@/components/ui/Input';
import { ConchAvatar } from '@/components/conch/ConchAvatar';
import { WaveDivider, BubbleBackground, FloatingElement } from '@/components/decorations/WaveDivider';
import { useAppStore } from '@/store';
import { formatRelativeTime, formatDate } from '@/utils/storage';
import { buildCharacters } from '@/data/sentences';
import { cn } from '@/lib/utils';
import { ClassRecord, Student } from '@/types';

type FilterStatus = 'all' | 'understood' | 'not_understood';

const ACHIEVEMENTS = [
  { id: 'first_lesson', name: '第一堂课', description: '完成你的第一堂教学课', icon: '🎓', color: 'var(--color-coral)' },
  { id: 'ten_lessons', name: '十堂课', description: '累计完成10堂教学课', icon: '📚', color: 'var(--color-seaweed)' },
  { id: 'fifty_lessons', name: '教学达人', description: '累计完成50堂教学课', icon: '🏆', color: 'var(--color-sand)' },
  { id: 'perfect_score', name: '满分老师', description: '正确率达到90%以上', icon: '⭐', color: 'var(--color-conch-purple)' },
  { id: 'root_master', name: '词根大师', description: '掌握10个以上词根', icon: '🌊', color: 'var(--color-ocean-deep)' },
  { id: 'patient_teacher', name: '耐心老师', description: '同一句子尝试5次以上最终成功', icon: '💪', color: 'var(--color-coral)' },
  { id: 'error_detective', name: '错误侦探', description: '发现并记录5种不同错误模式', icon: '🔍', color: 'var(--color-seaweed)' },
  { id: 'all_students', name: '桃李满天下', description: '教过所有学生', icon: '🐚', color: 'var(--color-sand)' },
];

export const Records: React.FC = () => {
  const { classRecords, errorCases, progress, students, sentences, roots } = useAppStore();

  const [selectedStudentId, setSelectedStudentId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAllAchievements, setShowAllAchievements] = useState(false);

  const stats = useMemo(() => {
    const totalClasses = classRecords.length;
    const correctCount = classRecords.filter((r) => r.understood).length;
    const wrongCount = totalClasses - correctCount;
    const accuracy = totalClasses > 0 ? Math.round((correctCount / totalClasses) * 100) : 0;
    const avgAttempts =
      totalClasses > 0
        ? Math.round(
            (classRecords.reduce((sum, r) => sum + r.attempts, 0) / totalClasses) * 10
          ) / 10
        : 0;

    return { totalClasses, correctCount, wrongCount, accuracy, avgAttempts };
  }, [classRecords]);

  const filteredRecords = useMemo(() => {
    return classRecords
      .filter((record) => {
        if (selectedStudentId !== 'all' && record.studentId !== selectedStudentId) return false;
        if (filterStatus === 'understood' && !record.understood) return false;
        if (filterStatus === 'not_understood' && record.understood) return false;
        if (searchTerm) {
          const sentence = sentences.find((s) => s.id === record.sentenceId);
          const chars = sentence ? buildCharacters(sentence.rootIds, roots) : '';
          const student = students.find((s) => s.id === record.studentId);
          const searchLower = searchTerm.toLowerCase();
          return (
            chars.toLowerCase().includes(searchLower) ||
            (student?.name.toLowerCase().includes(searchLower) ?? false) ||
            record.misunderstanding.toLowerCase().includes(searchLower)
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [classRecords, selectedStudentId, filterStatus, searchTerm, sentences, roots, students]);

  const unlockedAchievementIds = useMemo(() => {
    const ids = new Set<string>();
    progress.forEach((p) => {
      Object.entries(p.achievements).forEach(([id, achievement]) => {
        if (achievement.unlocked) ids.add(id);
      });
    });
    return ids;
  }, [progress]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getStudentById = (id: string): Student | undefined => students.find((s) => s.id === id);

  const getRecordSentence = (record: ClassRecord): string => {
    const sentence = sentences.find((s) => s.id === record.sentenceId);
    return sentence ? buildCharacters(sentence.rootIds, roots) : '已删除';
  };

  const statItems = [
    { label: '总课堂次数', value: stats.totalClasses, icon: BookOpen, color: 'var(--color-ocean-mid)', variant: 'ocean', suffix: '次' },
    { label: '正确次数', value: stats.correctCount, icon: CheckCircle, color: 'var(--color-seaweed)', variant: 'ocean', suffix: '次' },
    { label: '错误次数', value: stats.wrongCount, icon: XCircle, color: 'var(--color-coral)', variant: 'coral', suffix: '次' },
    { label: '整体正确率', value: `${stats.accuracy}%`, icon: TrendingUp, color: 'var(--color-sand)', variant: 'sand', suffix: '' },
    { label: '平均尝试次数', value: stats.avgAttempts, icon: Repeat, color: 'var(--color-conch-purple)', variant: 'default', suffix: '次' },
  ];

  const selectedStudent = selectedStudentId !== 'all' ? getStudentById(selectedStudentId) : null;

  return (
    <div className="relative min-h-screen">
      <BubbleBackground count={18} variant="dark" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-[var(--font-display)]">
            <span className="text-[var(--color-ocean-deep)]">教学</span>
            <span className="ml-3 bg-gradient-to-r from-[var(--color-coral)] via-[var(--color-sand)] to-[var(--color-seaweed)] bg-clip-text text-transparent">
              教学记录
            </span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            查看所有课堂记录、学习进度和成就徽章
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8"
        >
          {statItems.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card hover variant={stat.variant as 'default' | 'ocean' | 'coral' | 'sand'} className="relative overflow-hidden h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)] mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold" style={{ color: stat.color }}>
                        {stat.value}
                        <span className="text-base ml-1 opacity-70">{stat.suffix}</span>
                      </p>
                    </div>
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${stat.color}20` }}
                    >
                      <stat.icon size={24} style={{ color: stat.color }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card variant="glass">
            <CardContent className="p-5">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full lg:w-auto flex-1">
                  <div className="relative w-full sm:w-72">
                    <SearchInput
                      placeholder="搜索学生名字、句子或误解..."
                      value={searchTerm}
                      onSearch={setSearchTerm}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <div className="flex items-center gap-1 text-[var(--color-text-secondary)] text-sm">
                    <Filter size={16} />
                    <span>筛选：</span>
                  </div>

                  <div className="relative">
                    <select
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="appearance-none bg-white border-2 border-[var(--color-shallow-blue)]/30 rounded-full px-4 py-2 pr-10 text-sm text-[var(--color-ocean-deep)] focus:outline-none focus:border-[var(--color-ocean-mid)] cursor-pointer"
                    >
                      <option value="all">全部学生</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
                  </div>

                  <div className="flex gap-1 bg-[var(--color-foam)]/50 rounded-full p-1">
                    {[
                      { key: 'all' as const, label: '全部' },
                      { key: 'understood' as const, label: '理解' },
                      { key: 'not_understood' as const, label: '未理解' },
                    ].map((status) => (
                      <button
                        key={status.key}
                        onClick={() => setFilterStatus(status.key)}
                        className={cn(
                          'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300',
                          filterStatus === status.key
                            ? 'bg-white text-[var(--color-ocean-deep)] shadow-sm'
                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-ocean-deep)]'
                        )}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card variant="ocean">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListTodo size={24} className="text-[var(--color-ocean-mid)]" />
                  课堂记录时间线
                </CardTitle>
                <CardDescription>
                  共 {filteredRecords.length} 条记录
                  {selectedStudent && (
                    <span> · {selectedStudent.name}</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredRecords.length > 0 ? (
                  <div className="relative max-h-[700px] overflow-y-auto pr-2">
                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-[var(--color-ocean-light)] via-[var(--color-coral)]/30 to-[var(--color-seaweed)]/50" />
                    <div className="space-y-5">
                      {filteredRecords.map((record, index) => {
                        const student = getStudentById(record.studentId);
                        const sentenceChars = getRecordSentence(record);
                        return (
                          <motion.div
                            key={record.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="relative pl-11"
                          >
                            <div
                              className={cn(
                                'absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-3 border-white shadow-md z-10',
                                record.understood
                                  ? 'bg-gradient-to-br from-[var(--color-seaweed-light)] to-[var(--color-seaweed)]'
                                  : 'bg-gradient-to-br from-[var(--color-coral-light)] to-[var(--color-coral)]'
                              )}
                            >
                              {record.understood ? (
                                <CheckCircle size={16} className="text-white" />
                              ) : (
                                <XCircle size={16} className="text-white" />
                              )}
                            </div>

                            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex items-center gap-2">
                                  {student && (
                                    <ConchAvatar
                                      name={student.name}
                                      avatar={student.avatar}
                                      color={student.color}
                                      size="sm"
                                      showName={false}
                                      animate={false}
                                    />
                                  )}
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-lg font-[var(--font-display)] text-[var(--color-ocean-deep)]">
                                        {sentenceChars}
                                      </span>
                                      <Badge
                                        variant={record.understood ? 'seaweed' : 'coral'}
                                        size="sm"
                                      >
                                        {record.understood ? '✓ 理解' : '✗ 未理解'}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--color-text-muted)]">
                                      <span>{student?.name}</span>
                                      <span>·</span>
                                      <span>第{record.attempts}次尝试</span>
                                      <span>·</span>
                                      <span className="flex items-center gap-1">
                                        <Clock size={10} />
                                        {formatRelativeTime(record.timestamp)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-[10px] text-[var(--color-text-muted)] mt-1">
                                    {formatDate(record.timestamp)}
                                  </div>
                                </div>
                              </div>

                              {!record.understood && (
                                <div className="mt-3 space-y-2">
                                  {record.misunderstanding && (
                                    <div className="bg-[var(--color-coral)]/10 rounded-xl p-3">
                                      <div className="flex items-center gap-1.5 mb-1">
                                        <AlertTriangle size={13} className="text-[var(--color-coral)]" />
                                        <span className="text-xs font-semibold text-[var(--color-coral)]">误解原因</span>
                                      </div>
                                      <p className="text-sm text-[var(--color-text-secondary)]">
                                        {record.misunderstanding}
                                      </p>
                                    </div>
                                  )}
                                  {record.correction && (
                                    <div className="bg-[var(--color-seaweed)]/10 rounded-xl p-3">
                                      <div className="flex items-center gap-1.5 mb-1">
                                        <Lightbulb size={13} className="text-[var(--color-seaweed)]" />
                                        <span className="text-xs font-semibold text-[var(--color-seaweed)]">纠正方法</span>
                                      </div>
                                      <p className="text-sm text-[var(--color-text-secondary)]">
                                        {record.correction}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <BookOpen size={50} className="mx-auto mb-3 opacity-30 text-[var(--color-ocean-mid)]" />
                    <p className="text-[var(--color-text-muted)]">暂无符合条件的课堂记录</p>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">去课堂页面开始教学吧！</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <Card variant="coral">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle size={24} className="text-[var(--color-coral)]" />
                  错误案例库
                </CardTitle>
                <CardDescription>常见错误模式分析</CardDescription>
              </CardHeader>
              <CardContent>
                {errorCases.length > 0 ? (
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {errorCases.map((errorCase, index) => (
                      <motion.div
                        key={errorCase.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-white/70 rounded-xl p-4 border border-[var(--color-coral)]/10"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-coral)]/20 flex items-center justify-center">
                              <AlertTriangle size={16} className="text-[var(--color-coral)]" />
                            </div>
                            <span className="font-bold text-[var(--color-ocean-deep)]">
                              {errorCase.pattern}
                            </span>
                          </div>
                          <Badge variant="coral" size="sm">
                            {errorCase.occurrenceCount}次
                          </Badge>
                        </div>

                        <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                          {errorCase.description}
                        </p>

                        <div className="space-y-1.5 mt-3">
                          <div className="flex items-start gap-1.5">
                            <span className="text-xs text-[var(--color-text-muted)] w-16 flex-shrink-0">根因：</span>
                            <span className="text-xs text-[var(--color-text-secondary)]">
                              {errorCase.rootCause}
                            </span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <span className="text-xs text-[var(--color-text-muted)] w-16 flex-shrink-0">纠正：</span>
                            <span className="text-xs text-[var(--color-seaweed)]">
                              {errorCase.correctionMethod}
                            </span>
                          </div>
                          {errorCase.relatedRecordIds.length > 0 && (
                            <div className="flex items-start gap-1.5">
                              <span className="text-xs text-[var(--color-text-muted)] w-16 flex-shrink-0">关联：</span>
                              <span className="text-xs text-[var(--color-text-secondary)]">
                                {errorCase.relatedRecordIds.length}条记录
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle size={36} className="mx-auto mb-2 opacity-30 text-[var(--color-coral)]" />
                    <p className="text-sm text-[var(--color-text-muted)]">暂无错误案例</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card variant="sand">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={24} className="text-[var(--color-sand)]" />
                  学生正确率对比
                </CardTitle>
                <CardDescription>各学生学习进度</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student, index) => {
                    const studentRecords = classRecords.filter((r) => r.studentId === student.id);
                    const studentCorrect = studentRecords.filter((r) => r.understood).length;
                    const accuracy =
                      studentRecords.length > 0
                        ? Math.round((studentCorrect / studentRecords.length) * 100)
                        : 0;
                    return (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[var(--color-ocean-deep)]">
                              {student.name}
                            </span>
                            <Badge variant="secondary" size="sm">
                              {studentRecords.length}次
                            </Badge>
                          </div>
                          <span className="text-sm font-bold" style={{ color: student.color }}>
                            {accuracy}%
                          </span>
                        </div>
                        <ProgressBar
                          value={accuracy}
                          variant={
                            accuracy >= 80 ? 'seaweed' : accuracy >= 50 ? 'sand' : 'coral'
                          }
                          size="sm"
                          showLabel={false}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card variant="ocean">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={24} className="text-[var(--color-ocean-mid)]" />
                  学习趋势
                </CardTitle>
                <CardDescription>最近7次课堂记录</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    const recentRecords = [...classRecords]
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .slice(0, 7)
                      .reverse();

                    if (recentRecords.length === 0) {
                      return (
                        <div className="text-center py-8 text-[var(--color-text-muted)]">
                          <TrendingUp size={36} className="mx-auto mb-2 opacity-30" />
                          <p className="text-sm">暂无数据</p>
                        </div>
                      );
                    }

                    return recentRecords.map((record, index) => {
                      const student = getStudentById(record.studentId);
                      return (
                        <div
                          key={record.id}
                          className="flex items-center gap-3"
                        >
                          <div className="w-20 text-xs text-[var(--color-text-muted)] flex-shrink-0">
                            {formatRelativeTime(record.timestamp)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm text-[var(--color-ocean-deep)]">
                                  {getRecordSentence(record)}
                                </span>
                                {student && (
                                  <span className="text-xs text-[var(--color-text-muted)]">
                                    {' '}· {student.name}
                                  </span>
                                )}
                              </div>
                              <Badge
                                variant={record.understood ? 'seaweed' : 'coral'}
                                size="sm"
                              >
                                {record.understood ? '✓' : '✗'}
                              </Badge>
                            </div>
                            <ProgressBar
                              value={record.understood ? 100 : 40}
                              variant={record.understood ? 'seaweed' : 'coral'}
                              size="sm"
                              showLabel={false}
                            />
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card variant="glass">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy size={24} className="text-[var(--color-sand)]" />
                      成就徽章
                    </CardTitle>
                    <CardDescription>
                      已解锁 {unlockedAchievementIds.size}/{ACHIEVEMENTS.length}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllAchievements(!showAllAchievements)}
                  >
                    {showAllAchievements ? '收起' : '查看全部'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {(showAllAchievements ? ACHIEVEMENTS : ACHIEVEMENTS.slice(0, 4)).map(
                    (achievement, index) => {
                      const isUnlocked = unlockedAchievementIds.has(achievement.id);
                      return (
                        <FloatingElement key={achievement.id} delay={index * 0.08}>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * index }}
                            className={cn(
                              'relative rounded-2xl p-4 text-center transition-all duration-300',
                              isUnlocked
                                ? 'bg-gradient-to-br from-white to-[var(--color-foam)] shadow-md border border-[var(--color-sand)]/30'
                                : 'bg-gray-100/50 opacity-70'
                            )}
                          >
                            <div
                              className={cn(
                                'w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-2 text-3xl',
                                isUnlocked ? '' : 'grayscale'
                              )}
                              style={{
                                backgroundColor: isUnlocked ? `${achievement.color}20` : 'transparent'
                              }}
                            >
                              {isUnlocked ? achievement.icon : <Lock size={24} className="text-gray-400" />}
                            </div>
                            <p
                              className={cn(
                                'text-sm font-bold',
                                isUnlocked
                                  ? 'text-[var(--color-ocean-deep)]'
                                  : 'text-gray-400'
                              )}
                            >
                              {achievement.name}
                            </p>
                            <p
                              className={cn(
                                'text-xs mt-1',
                                isUnlocked
                                  ? 'text-[var(--color-text-muted)]'
                                  : 'text-gray-400'
                              )}
                            >
                              {achievement.description}
                            </p>
                            {isUnlocked && (
                              <Sparkles size={16} className="absolute top-2 right-2 text-[var(--color-sand)]" />
                            )}
                          </motion.div>
                        </FloatingElement>
                      );
                    }
                  )}
                </div>

                {!showAllAchievements && ACHIEVEMENTS.length > 4 && (
                  <div className="mt-4 pt-4 border-t border-[var(--color-foam)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-[var(--color-sand)]" />
                        <span className="text-sm text-[var(--color-text-secondary)]">
                          还有 {ACHIEVEMENTS.length - 4} 个成就待解锁
                        </span>
                      </div>
                      <ProgressBar
                        value={(unlockedAchievementIds.size / ACHIEVEMENTS.length) * 100}
                        variant="sand"
                        size="sm"
                        showLabel={false}
                        className="w-32"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <WaveDivider variant="ocean" height="lg" className="mt-16" />
    </div>
  );
};
