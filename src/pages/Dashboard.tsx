import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Award, 
  Clock,
  ChevronRight,
  Puzzle,
  Volume2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ConchAvatar } from '@/components/conch/ConchAvatar';
import { WaveDivider, BubbleBackground, FloatingElement } from '@/components/decorations/WaveDivider';
import { useAppStore } from '@/store';
import { getPersonalityLabel } from '@/data/students';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { students, progress, lessons, classRecords } = useAppStore();
  
  const totalStudents = students.length;
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter(l => l.status === 'completed').length;
  const totalRecords = classRecords.length;
  
  const understoodRecords = classRecords.filter(r => r.understood).length;
  const avgAccuracy = totalRecords > 0
    ? Math.round((understoodRecords / totalRecords) * 100)
    : 0;
  
  const unlockedAchievements = progress.reduce((sum, p) => 
    sum + Object.values(p.achievements).filter(a => a.unlocked).length, 0
  );

  const quickActions = [
    { label: '开始造句', icon: Puzzle, path: '/builder', color: 'var(--color-coral)' },
    { label: '练习发音', icon: Volume2, path: '/pronunciation', color: 'var(--color-seaweed)' },
    { label: '进入课堂', icon: GraduationCap, path: '/classroom', color: 'var(--color-sand)' },
    { label: '词库管理', icon: BookOpen, path: '/lexicon', color: 'var(--color-conch-purple)' },
  ];

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
    <div className="relative">
      <BubbleBackground count={15} variant="dark" />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-[var(--font-display)]">
            <span className="text-[var(--color-ocean-deep)]">欢迎来到</span>
            <span className="ml-3 bg-gradient-to-r from-[var(--color-coral)] via-[var(--color-sand)] to-[var(--color-seaweed)] bg-clip-text text-transparent">
              海螺语言学院
            </span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            教可爱的海螺族学习人类语言，通过排列词根、声调和手势让它们完成动作
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {[
            { label: '学生总数', value: totalStudents, icon: Users, color: 'var(--color-coral)', suffix: '位' },
            { label: '课程总数', value: totalLessons, icon: BookOpen, color: 'var(--color-seaweed)', suffix: '门' },
            { label: '平均正确率', value: avgAccuracy, icon: TrendingUp, color: 'var(--color-sand)', suffix: '%' },
            { label: '解锁成就', value: unlockedAchievements, icon: Award, color: 'var(--color-conch-purple)', suffix: '个' },
          ].map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card hover variant="ocean" className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)] mb-1">{stat.label}</p>
                      <p className="text-4xl font-bold" style={{ color: stat.color }}>
                        {stat.value}
                        <span className="text-lg ml-1 opacity-70">{stat.suffix}</span>
                      </p>
                    </div>
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${stat.color}20` }}
                    >
                      <stat.icon size={28} style={{ color: stat.color }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card variant="glass">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users size={24} className="text-[var(--color-ocean-mid)]" />
                      我的学生
                    </CardTitle>
                    <CardDescription>点击学生卡片查看详情</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/students')}>
                    查看全部 <ChevronRight size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {students.slice(0, 5).map((student, index) => (
                    <FloatingElement key={student.id} delay={index * 0.1}>
                      <div 
                        className="cursor-pointer"
                        onClick={() => navigate('/students')}
                      >
                        <ConchAvatar
                          name={student.name}
                          avatar={student.avatar}
                          color={student.color}
                          size="md"
                          animate={false}
                        />
                        <div className="mt-2 text-center">
                          <Badge variant="secondary" size="sm">
                            Lv.{student.level}
                          </Badge>
                          <p className="text-xs text-[var(--color-text-muted)] mt-1">
                            {getPersonalityLabel(student.personality)}
                          </p>
                          <div className="mt-2">
                            <ProgressBar 
                              value={student.accuracy * 100} 
                              size="sm" 
                              variant="seaweed"
                              showLabel={false}
                            />
                          </div>
                        </div>
                      </div>
                    </FloatingElement>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="coral">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={24} className="text-[var(--color-coral)]" />
                  今日任务
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { task: '完成1节基础问候课', progress: completedLessons > 0 ? 100 : 0 },
                    { task: '教对3个句子', progress: Math.min(totalRecords * 33, 100) },
                    { task: '解锁1个新成就', progress: unlockedAchievements > 0 ? 100 : 0 },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[var(--color-text-secondary)]">{item.task}</span>
                        <span className="font-medium text-[var(--color-ocean-deep)]">{item.progress}%</span>
                      </div>
                      <ProgressBar value={item.progress} size="sm" variant="coral" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-3xl">⚡</span>
            快速开始
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
                onClick={() => navigate(action.path)}
              >
                <Card hover variant="default" className="text-center h-full">
                  <CardContent className="p-6">
                    <div 
                      className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                      style={{ 
                        background: `linear-gradient(135deg, ${action.color}40, ${action.color}20)`,
                      }}
                    >
                      <action.icon size={32} style={{ color: action.color }} />
                    </div>
                    <h3 className="font-bold text-[var(--color-ocean-deep)]">{action.label}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card variant="sand">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen size={24} className="text-[var(--color-sand)]" />
                      最近课程
                    </CardTitle>
                    <CardDescription>继续你的教学之旅</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/courses')}>
                    全部课程 <ChevronRight size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lessons.slice(0, 3).map((lesson) => (
                    <div 
                      key={lesson.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-colors cursor-pointer group"
                      onClick={() => navigate('/courses')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-sand)]/30 flex items-center justify-center">
                          <GraduationCap size={20} className="text-[var(--color-ocean-deep)]" />
                        </div>
                        <div>
                          <p className="font-medium text-[var(--color-ocean-deep)]">{lesson.title}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            {lesson.sentenceIds.length} 个句子
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={lesson.status === 'completed' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {lesson.status === 'completed' ? '已完成' : lesson.status === 'in_progress' ? '进行中' : '未开始'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card variant="ocean">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp size={24} className="text-[var(--color-ocean-mid)]" />
                      学习进度
                    </CardTitle>
                    <CardDescription>整体教学进度概览</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[var(--color-text-secondary)]">课程完成率</span>
                      <span className="font-bold text-[var(--color-ocean-deep)]">
                        {completedLessons}/{totalLessons}
                      </span>
                    </div>
                    <ProgressBar 
                      value={totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0} 
                      variant="ocean"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[var(--color-text-secondary)]">平均正确率</span>
                      <span className="font-bold text-[var(--color-seaweed)]">{avgAccuracy}%</span>
                    </div>
                    <ProgressBar value={avgAccuracy} variant="seaweed" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[var(--color-text-secondary)]">课堂记录</span>
                      <span className="font-bold text-[var(--color-coral)]">{totalRecords} 条</span>
                    </div>
                    <ProgressBar value={Math.min(totalRecords * 10, 100)} variant="coral" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      <WaveDivider variant="ocean" height="lg" className="mt-16" />
    </div>
  );
};
