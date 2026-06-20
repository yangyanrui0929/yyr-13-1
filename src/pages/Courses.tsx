import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  AlertTriangle,
  Check,
  ChevronRight,
  ListOrdered,
  Users,
  FileText,
  Play,
  Pause,
  CheckCircle,
  FileEdit,
  Languages,
  Hand
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, SearchInput } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { BubbleBackground, WaveDivider } from '@/components/decorations/WaveDivider';
import { useAppStore } from '@/store';
import { buildCharacters, buildPinyinWithTones } from '@/data/sentences';
import { applyToneToPinyin } from '@/data/tones';
import { Lesson, Sentence, LessonStatus } from '@/types';

type StatusFilter = 'all' | LessonStatus;

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: '全部课程' },
  { value: 'draft', label: '未开始' },
  { value: 'in_progress', label: '进行中' },
  { value: 'completed', label: '已完成' },
];

const getStatusLabel = (status: LessonStatus): string => {
  const map: Record<LessonStatus, string> = {
    draft: '草稿',
    in_progress: '进行中',
    completed: '已完成',
  };
  return map[status];
};

const getStatusBadgeVariant = (status: LessonStatus): 'secondary' | 'sand' | 'seaweed' | 'coral' => {
  const map: Record<LessonStatus, 'secondary' | 'sand' | 'seaweed' | 'coral'> = {
    draft: 'secondary',
    in_progress: 'sand',
    completed: 'seaweed',
  };
  return map[status];
};

interface LessonFormData {
  title: string;
  description: string;
  targetStudentId: string;
  sentenceIds: string[];
  status: LessonStatus;
  order: number;
}

const initialFormData: LessonFormData = {
  title: '',
  description: '',
  targetStudentId: '',
  sentenceIds: [],
  status: 'draft',
  order: 1,
};

export const Courses: React.FC = () => {
  const { lessons, sentences, students, roots, tones, addLesson, updateLesson, deleteLesson, classRecords } = useAppStore();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<LessonFormData>(initialFormData);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [deletingLesson, setDeletingLesson] = useState<Lesson | null>(null);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
  const [sentenceSearch, setSentenceSearch] = useState('');

  const sortedLessons = useMemo(() => {
    return [...lessons].sort((a, b) => a.order - b.order);
  }, [lessons]);

  const filteredLessons = useMemo(() => {
    return sortedLessons.filter((lesson) => {
      const matchesSearch = !searchKeyword ||
        lesson.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchKeyword.toLowerCase());

      const matchesStatus = selectedStatus === 'all' || lesson.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [sortedLessons, searchKeyword, selectedStatus]);

  const getSentencesForLesson = (lesson: Lesson): Sentence[] => {
    return lesson.sentenceIds
      .map(id => sentences.find(s => s.id === id))
      .filter(Boolean) as Sentence[];
  };

  const getStudentName = (studentId: string): string => {
    const student = students.find(s => s.id === studentId);
    return student?.name || '未分配';
  };

  const getLessonProgress = (lesson: Lesson): number => {
    const lessonRecords = classRecords.filter(r => r.lessonId === lesson.id);
    if (lesson.sentenceIds.length === 0) return 0;
    const uniqueUnderstood = new Set(
      lessonRecords.filter(r => r.understood).map(r => r.sentenceId)
    );
    return Math.round((uniqueUnderstood.size / lesson.sentenceIds.length) * 100);
  };

  const openAddModal = () => {
    setEditingLesson(null);
    setFormData({
      ...initialFormData,
      order: lessons.length + 1,
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      description: lesson.description,
      targetStudentId: lesson.targetStudentId,
      sentenceIds: [...lesson.sentenceIds],
      status: lesson.status,
      order: lesson.order,
    });
    setIsAddModalOpen(true);
  };

  const openDeleteModal = (lesson: Lesson) => {
    setDeletingLesson(lesson);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsDeleteModalOpen(false);
    setEditingLesson(null);
    setDeletingLesson(null);
    setSentenceSearch('');
  };

  const toggleLessonExpand = (lessonId: string) => {
    setExpandedLessonId(expandedLessonId === lessonId ? null : lessonId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const lessonData = {
      title: formData.title,
      description: formData.description,
      targetStudentId: formData.targetStudentId,
      sentenceIds: formData.sentenceIds,
      status: formData.status,
      order: formData.order,
    };

    if (editingLesson) {
      updateLesson(editingLesson.id, lessonData);
    } else {
      addLesson(lessonData);
    }

    closeModals();
  };

  const handleDelete = () => {
    if (deletingLesson) {
      deleteLesson(deletingLesson.id);
    }
    closeModals();
  };

  const handleStatusChange = (lessonId: string, newStatus: LessonStatus) => {
    updateLesson(lessonId, { status: newStatus });
  };

  const toggleSentenceSelection = (sentenceId: string) => {
    setFormData(prev => ({
      ...prev,
      sentenceIds: prev.sentenceIds.includes(sentenceId)
        ? prev.sentenceIds.filter(id => id !== sentenceId)
        : [...prev.sentenceIds, sentenceId],
    }));
  };

  const filteredSentences = useMemo(() => {
    if (!sentenceSearch) return sentences;
    return sentences.filter(sentence => {
      const chars = buildCharacters(sentence.rootIds, roots);
      const pinyin = buildPinyinWithTones(sentence.rootIds, sentence.tones, roots, applyToneToPinyin);
      return (
        chars.includes(sentenceSearch) ||
        pinyin.toLowerCase().includes(sentenceSearch.toLowerCase()) ||
        sentence.translation.toLowerCase().includes(sentenceSearch.toLowerCase())
      );
    });
  }, [sentences, roots, sentenceSearch]);

  const stats = useMemo(() => {
    const total = lessons.length;
    const draft = lessons.filter(l => l.status === 'draft').length;
    const inProgress = lessons.filter(l => l.status === 'in_progress').length;
    const completed = lessons.filter(l => l.status === 'completed').length;
    return { total, draft, inProgress, completed };
  }, [lessons]);

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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div className="relative min-h-screen">
      <BubbleBackground count={15} variant="dark" />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-[var(--font-display)]">
            <span className="text-[var(--color-ocean-deep)]">
              <GraduationCap className="inline-block mr-3 mb-1" size={40} />
              课程中心
            </span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            管理和组织汉语课程，为每个学生定制专属学习计划
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <Card variant="ocean" className="text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-[var(--color-ocean-deep)]">{stats.total}</div>
              <div className="text-sm text-[var(--color-text-secondary)] mt-1">总课程数</div>
            </CardContent>
          </Card>
          <Card variant="glass" className="text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-[var(--color-text-secondary)]">{stats.draft}</div>
              <div className="text-sm text-[var(--color-text-muted)] mt-1">未开始</div>
            </CardContent>
          </Card>
          <Card variant="sand" className="text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-[var(--color-ocean-deep)]">{stats.inProgress}</div>
              <div className="text-sm text-[var(--color-text-secondary)] mt-1">进行中</div>
            </CardContent>
          </Card>
          <Card variant="ocean" className="text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-[var(--color-seaweed)]">{stats.completed}</div>
              <div className="text-sm text-[var(--color-text-secondary)] mt-1">已完成</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card variant="ocean" className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex-1 w-full md:w-auto">
                  <SearchInput
                    placeholder="搜索课程标题或描述..."
                    value={searchKeyword}
                    onSearch={setSearchKeyword}
                    className="w-full md:w-80"
                  />
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <Button
                    variant="secondary"
                    onClick={() => setShowFilters(!showFilters)}
                    rightIcon={showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  >
                    <Filter size={18} />
                    筛选
                  </Button>
                  <Button
                    variant="primary"
                    onClick={openAddModal}
                    leftIcon={<Plus size={18} />}
                  >
                    创建课程
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 mt-4 border-t border-[var(--color-foam)]">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                          课程状态
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {statusOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setSelectedStatus(option.value)}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                selectedStatus === option.value
                                  ? 'bg-[var(--color-ocean-deep)] text-white'
                                  : 'bg-[var(--color-foam)] text-[var(--color-text-secondary)] hover:bg-[var(--color-shallow-blue)]/30'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filteredLessons.length === 0 ? (
            <div className="col-span-full">
              <Card variant="glass" className="text-center py-12">
                <CardContent>
                  <BookOpen size={48} className="mx-auto text-[var(--color-text-muted)] mb-4" />
                  <p className="text-[var(--color-text-muted)] text-lg">没有找到匹配的课程</p>
                  <Button
                    variant="primary"
                    onClick={openAddModal}
                    leftIcon={<Plus size={18} />}
                    className="mt-4"
                  >
                    创建第一个课程
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredLessons.map((lesson) => {
              const lessonSentences = getSentencesForLesson(lesson);
              const progress = getLessonProgress(lesson);
              const isExpanded = expandedLessonId === lesson.id;

              return (
                <motion.div
                  key={lesson.id}
                  variants={cardVariants}
                  layout
                >
                  <Card
                    variant={lesson.status === 'completed' ? 'ocean' : 'glass'}
                    hover
                    className="overflow-hidden"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <Badge variant="purple" size="sm">
                              <ListOrdered size={12} className="mr-1" />
                              第 {lesson.order} 课
                            </Badge>
                            <Badge variant={getStatusBadgeVariant(lesson.status)} size="sm">
                              {getStatusLabel(lesson.status)}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg truncate">
                            {lesson.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {lesson.description}
                          </CardDescription>
                        </div>
                        <button
                          onClick={() => toggleLessonExpand(lesson.id)}
                          className="flex-shrink-0 p-2 rounded-full hover:bg-[var(--color-foam)] transition-colors"
                        >
                          <ChevronRight
                            size={20}
                            className={`text-[var(--color-ocean-mid)] transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
                          />
                        </button>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Users size={16} className="text-[var(--color-ocean-mid)] flex-shrink-0" />
                            <span className="text-[var(--color-text-secondary)] truncate">
                              {getStudentName(lesson.targetStudentId)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <FileText size={16} className="text-[var(--color-ocean-mid)] flex-shrink-0" />
                            <span className="text-[var(--color-text-secondary)]">
                              {lessonSentences.length} 个句子
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-[var(--color-text-muted)]">学习进度</span>
                            <span className="text-xs font-medium text-[var(--color-ocean-deep)]">{progress}%</span>
                          </div>
                          <ProgressBar
                            value={progress}
                            variant={lesson.status === 'completed' ? 'seaweed' : 'ocean'}
                            size="sm"
                          />
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {lesson.status !== 'draft' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(lesson.id, 'draft')}
                              leftIcon={<FileEdit size={14} />}
                            >
                              设为草稿
                            </Button>
                          )}
                          {lesson.status !== 'in_progress' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(lesson.id, 'in_progress')}
                              leftIcon={<Play size={14} />}
                              className="text-[var(--color-sand)] hover:text-[var(--color-sand)]"
                            >
                              开始学习
                            </Button>
                          )}
                          {lesson.status !== 'completed' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(lesson.id, 'completed')}
                              leftIcon={<CheckCircle size={14} />}
                              className="text-[var(--color-seaweed)] hover:text-[var(--color-seaweed)]"
                            >
                              标记完成
                            </Button>
                          )}
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-5 pt-5 border-t border-[var(--color-foam)]">
                              <h4 className="text-sm font-bold text-[var(--color-ocean-deep)] mb-3 flex items-center gap-2">
                                <Languages size={16} />
                                课程句子列表
                              </h4>
                              {lessonSentences.length === 0 ? (
                                <p className="text-sm text-[var(--color-text-muted)] py-4 text-center bg-[var(--color-foam)]/30 rounded-xl">
                                  暂无句子
                                </p>
                              ) : (
                                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                  {lessonSentences.map((sentence, idx) => {
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
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="p-3 rounded-xl bg-white/60 border border-[var(--color-shallow-blue)]/20"
                                      >
                                        <div className="flex items-start justify-between gap-3">
                                          <div className="flex-1 min-w-0">
                                            <div className="text-lg font-bold text-[var(--color-ocean-deep)]">
                                              {chars}
                                            </div>
                                            <div className="text-sm text-[var(--color-ocean-mid)] mt-0.5">
                                              {pinyin}
                                            </div>
                                            <div className="text-sm text-[var(--color-text-secondary)] mt-1">
                                              {sentence.translation}
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-2 text-xs text-[var(--color-text-muted)]">
                                              <Hand size={12} />
                                              <span>{sentence.expectedAction}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>

                    <CardFooter className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(lesson)}
                        leftIcon={<Edit2 size={14} />}
                      >
                        编辑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteModal(lesson)}
                        leftIcon={<Trash2 size={14} />}
                        className="text-[var(--color-coral)] hover:text-[var(--color-coral)]"
                      >
                        删除
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>

      <WaveDivider variant="ocean" height="md" className="mt-16" />

      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            key="add-modal"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModals} />
            <motion.div
              variants={modalVariants}
              className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              <Card variant="default" className="max-h-[90vh] flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        {editingLesson ? '编辑课程' : '创建新课程'}
                      </CardTitle>
                      <CardDescription>
                        {editingLesson ? '修改课程信息和内容' : '输入新课程的详细信息'}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={closeModals}
                      leftIcon={<X size={16} />}
                    />
                  </div>
                </CardHeader>
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                  <CardContent className="space-y-4 overflow-y-auto flex-1 pr-1">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                        课程标题
                      </label>
                      <Input
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="例如：第一课：基础问候"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                        课程描述
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="简要描述本课程的学习目标和内容..."
                        className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--color-shallow-blue)]/30 bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-ocean-mid)] focus:ring-4 focus:ring-[var(--color-ocean-mid)]/10 transition-all duration-300 min-h-[80px] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                          目标学生
                        </label>
                        <select
                          required
                          value={formData.targetStudentId}
                          onChange={(e) => setFormData({ ...formData, targetStudentId: e.target.value })}
                          className="w-full px-4 py-3 rounded-full border-2 border-[var(--color-shallow-blue)]/30 bg-white text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-ocean-mid)] focus:ring-4 focus:ring-[var(--color-ocean-mid)]/10 transition-all duration-300"
                        >
                          <option value="">请选择学生</option>
                          {students.map((student) => (
                            <option key={student.id} value={student.id}>
                              {student.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                          排序号
                        </label>
                        <Input
                          type="number"
                          min={1}
                          required
                          value={formData.order}
                          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                        课程状态
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(['draft', 'in_progress', 'completed'] as LessonStatus[]).map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => setFormData({ ...formData, status })}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                              formData.status === status
                                ? 'bg-[var(--color-ocean-deep)] text-white'
                                : 'bg-[var(--color-foam)] text-[var(--color-text-secondary)] hover:bg-[var(--color-shallow-blue)]/30'
                            }`}
                          >
                            {getStatusLabel(status)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                        选择课程句子
                        <span className="ml-2 text-[var(--color-text-muted)] font-normal">
                          （已选 {formData.sentenceIds.length} 个）
                        </span>
                      </label>
                      <div className="mb-3">
                        <SearchInput
                          placeholder="搜索句子..."
                          value={sentenceSearch}
                          onSearch={setSentenceSearch}
                        />
                      </div>
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1 border border-[var(--color-foam)] rounded-2xl p-3">
                        {filteredSentences.length === 0 ? (
                          <p className="text-sm text-[var(--color-text-muted)] text-center py-4">
                            没有找到句子
                          </p>
                        ) : (
                          filteredSentences.map((sentence) => {
                            const chars = buildCharacters(sentence.rootIds, roots);
                            const pinyin = buildPinyinWithTones(
                              sentence.rootIds,
                              sentence.tones,
                              roots,
                              applyToneToPinyin
                            );
                            const isSelected = formData.sentenceIds.includes(sentence.id);
                            return (
                              <button
                                key={sentence.id}
                                type="button"
                                onClick={() => toggleSentenceSelection(sentence.id)}
                                className={`w-full text-left p-3 rounded-xl transition-all duration-200 border-2 ${
                                  isSelected
                                    ? 'bg-[var(--color-ocean-deep)]/10 border-[var(--color-ocean-mid)]'
                                    : 'bg-white border-transparent hover:bg-[var(--color-foam)]/50'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                    isSelected
                                      ? 'bg-[var(--color-ocean-deep)] border-[var(--color-ocean-deep)]'
                                      : 'border-[var(--color-text-muted)]'
                                  }`}>
                                    {isSelected && <Check size={12} className="text-white" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-[var(--color-ocean-deep)]">
                                      {chars}
                                    </div>
                                    <div className="text-xs text-[var(--color-ocean-mid)]">
                                      {pinyin}
                                    </div>
                                    <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                                      {sentence.translation}
                                    </div>
                                  </div>
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-3 flex-shrink-0">
                    <Button variant="secondary" onClick={closeModals} type="button">
                      取消
                    </Button>
                    <Button variant="primary" type="submit">
                      {editingLesson ? '保存修改' : '创建课程'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            key="delete-modal"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModals} />
            <motion.div
              variants={modalVariants}
              className="relative z-10 w-full max-w-md"
            >
              <Card variant="coral">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle size={24} className="text-[var(--color-coral)]" />
                    确认删除
                  </CardTitle>
                  <CardDescription>
                    此操作不可撤销
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--color-text-secondary)]">
                    确定要删除课程{' '}
                    <span className="font-bold text-[var(--color-ocean-deep)]">
                      {deletingLesson?.title}
                    </span>{' '}
                    吗？
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-3">
                  <Button variant="secondary" onClick={closeModals}>
                    取消
                  </Button>
                  <Button variant="danger" onClick={handleDelete} leftIcon={<Trash2 size={16} />}>
                    确认删除
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
