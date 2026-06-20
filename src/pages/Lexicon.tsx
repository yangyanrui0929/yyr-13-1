import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Star, 
  StarOff,
  Filter,
  ChevronDown,
  ChevronUp,
  BookMarked,
  MessageSquare,
  AlertTriangle,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, SearchInput } from '@/components/ui/Input';
import { BubbleBackground, WaveDivider } from '@/components/decorations/WaveDivider';
import { useAppStore } from '@/store';
import { getCategoryLabel, getCategoryColor } from '@/data/roots';
import { Root, RootCategory } from '@/types';

const categoryOptions: { value: RootCategory | 'all'; label: string }[] = [
  { value: 'all', label: '全部词性' },
  { value: 'noun', label: '名词' },
  { value: 'verb', label: '动词' },
  { value: 'adjective', label: '形容词' },
  { value: 'adverb', label: '副词' },
  { value: 'pronoun', label: '代词' },
  { value: 'particle', label: '助词' },
];

const difficultyOptions = [
  { value: 0, label: '全部难度' },
  { value: 1, label: '★ 入门' },
  { value: 2, label: '★★ 简单' },
  { value: 3, label: '★★★ 中等' },
  { value: 4, label: '★★★★ 困难' },
  { value: 5, label: '★★★★★ 专家' },
];

const StarRating: React.FC<{ rating: number; max?: number }> = ({ rating, max = 5 }) => {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? 'text-[var(--color-sand)] fill-[var(--color-sand)]' : 'text-[var(--color-text-muted)]'}
        />
      ))}
    </div>
  );
};

interface RootFormData {
  character: string;
  pinyin: string;
  meaning: string;
  category: RootCategory;
  difficulty: 1 | 2 | 3 | 4 | 5;
  examples: string;
}

const initialFormData: RootFormData = {
  character: '',
  pinyin: '',
  meaning: '',
  category: 'noun',
  difficulty: 1,
  examples: '',
};

export const Lexicon: React.FC = () => {
  const { roots, grammarRules, addRoot, updateRoot, deleteRoot } = useAppStore();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RootCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [formData, setFormData] = useState<RootFormData>(initialFormData);
  const [editingRoot, setEditingRoot] = useState<Root | null>(null);
  const [deletingRoot, setDeletingRoot] = useState<Root | null>(null);
  const [viewingRoot, setViewingRoot] = useState<Root | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredRoots = useMemo(() => {
    return roots.filter((root) => {
      const matchesSearch = !searchKeyword || 
        root.character.includes(searchKeyword) ||
        root.pinyin.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        root.meaning.toLowerCase().includes(searchKeyword.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || root.category === selectedCategory;
      
      const matchesDifficulty = selectedDifficulty === 0 || root.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [roots, searchKeyword, selectedCategory, selectedDifficulty]);

  const relatedGrammarRules = useMemo(() => {
    if (!viewingRoot) return [];
    return grammarRules.filter(rule => 
      rule.examples.some(example => 
        example.includes(viewingRoot.character)
      )
    );
  }, [viewingRoot, grammarRules]);

  const openAddModal = () => {
    setEditingRoot(null);
    setFormData(initialFormData);
    setIsAddModalOpen(true);
  };

  const openEditModal = (root: Root) => {
    setEditingRoot(root);
    setFormData({
      character: root.character,
      pinyin: root.pinyin,
      meaning: root.meaning,
      category: root.category,
      difficulty: root.difficulty,
      examples: root.examples.join('、'),
    });
    setIsAddModalOpen(true);
  };

  const openDeleteModal = (root: Root) => {
    setDeletingRoot(root);
    setIsDeleteModalOpen(true);
  };

  const openDetailModal = (root: Root) => {
    setViewingRoot(root);
    setIsDetailModalOpen(true);
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsDetailModalOpen(false);
    setEditingRoot(null);
    setDeletingRoot(null);
    setViewingRoot(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const rootData = {
      character: formData.character,
      pinyin: formData.pinyin,
      meaning: formData.meaning,
      category: formData.category,
      difficulty: formData.difficulty,
      examples: formData.examples.split(/[、,，\n]/).map(s => s.trim()).filter(Boolean),
    };

    if (editingRoot) {
      updateRoot(editingRoot.id, rootData);
    } else {
      addRoot(rootData);
    }
    
    closeModals();
  };

  const handleDelete = () => {
    if (deletingRoot) {
      deleteRoot(deletingRoot.id);
    }
    closeModals();
  };

  const getCategoryBadgeVariant = (category: string): 'coral' | 'seaweed' | 'sand' | 'purple' | 'secondary' => {
    const variantMap: Record<string, 'coral' | 'seaweed' | 'sand' | 'purple' | 'secondary'> = {
      noun: 'coral',
      verb: 'seaweed',
      adjective: 'sand',
      adverb: 'purple',
      pronoun: 'secondary',
      particle: 'secondary',
    };
    return variantMap[category] || 'secondary';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
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
      <BubbleBackground count={12} variant="dark" />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-[var(--font-display)]">
            <span className="text-[var(--color-ocean-deep)]">
              <BookOpen className="inline-block mr-3 mb-1" size={40} />
              词库管理
            </span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            管理和学习汉语词根，掌握语言的基本构成单元
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="ocean" className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex-1 w-full md:w-auto">
                  <SearchInput
                    placeholder="搜索汉字、拼音或含义..."
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
                    添加词根
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
                    <div className="pt-4 mt-4 border-t border-[var(--color-foam)] grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                          词性分类
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {categoryOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setSelectedCategory(option.value)}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                selectedCategory === option.value
                                  ? 'bg-[var(--color-ocean-deep)] text-white'
                                  : 'bg-[var(--color-foam)] text-[var(--color-text-secondary)] hover:bg-[var(--color-shallow-blue)]/30'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                          难度等级
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {difficultyOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setSelectedDifficulty(option.value)}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                selectedDifficulty === option.value
                                  ? 'bg-[var(--color-sand)] text-[var(--color-ocean-deep)]'
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
        >
          <Card variant="glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookMarked size={24} className="text-[var(--color-ocean-mid)]" />
                    词根列表
                  </CardTitle>
                  <CardDescription>
                    共 {filteredRoots.length} 个词根
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-foam)]">
                    <th className="text-left py-3 px-4 text-[var(--color-text-secondary)] font-medium">
                      汉字
                    </th>
                    <th className="text-left py-3 px-4 text-[var(--color-text-secondary)] font-medium">
                      拼音
                    </th>
                    <th className="text-left py-3 px-4 text-[var(--color-text-secondary)] font-medium">
                      词性
                    </th>
                    <th className="text-left py-3 px-4 text-[var(--color-text-secondary)] font-medium">
                      难度
                    </th>
                    <th className="text-left py-3 px-4 text-[var(--color-text-secondary)] font-medium">
                      含义
                    </th>
                    <th className="text-right py-3 px-4 text-[var(--color-text-secondary)] font-medium">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoots.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-[var(--color-text-muted)]">
                        没有找到匹配的词根
                      </td>
                    </tr>
                  ) : (
                    filteredRoots.map((root) => (
                      <motion.tr
                        key={root.id}
                        variants={rowVariants}
                        className="border-b border-[var(--color-foam)]/50 hover:bg-[var(--color-foam)]/30 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <button
                            onClick={() => openDetailModal(root)}
                            className="text-2xl font-bold text-[var(--color-ocean-deep)] hover:text-[var(--color-ocean-mid)] transition-colors"
                          >
                            {root.character}
                          </button>
                        </td>
                        <td className="py-4 px-4 text-[var(--color-text-secondary)]">
                          {root.pinyin}
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={getCategoryBadgeVariant(root.category)}
                            size="sm"
                          >
                            {getCategoryLabel(root.category)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <StarRating rating={root.difficulty} />
                        </td>
                        <td className="py-4 px-4 text-[var(--color-text-secondary)]">
                          {root.meaning}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(root)}
                              leftIcon={<Edit2 size={14} />}
                            >
                              编辑
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteModal(root)}
                              leftIcon={<Trash2 size={14} />}
                              className="text-[var(--color-coral)] hover:text-[var(--color-coral)]"
                            >
                              删除
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
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
            className="relative z-10 w-full max-w-lg"
          >
            <Card variant="default">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {editingRoot ? '编辑词根' : '添加词根'}
                    </CardTitle>
                    <CardDescription>
                      {editingRoot ? '修改词根信息' : '输入新词根的详细信息'}
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
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                      汉字
                    </label>
                    <Input
                      required
                      value={formData.character}
                      onChange={(e) => setFormData({ ...formData, character: e.target.value })}
                      placeholder="例如：你"
                    />
                  </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                        拼音
                      </label>
                      <Input
                        required
                        value={formData.pinyin}
                        onChange={(e) => setFormData({ ...formData, pinyin: e.target.value })}
                        placeholder="例如：nǐ"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                      含义
                    </label>
                    <Input
                      required
                      value={formData.meaning}
                      onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                      placeholder="例如：you"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                        词性
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as RootCategory })}
                        className="w-full px-4 py-3 rounded-full border-2 border-[var(--color-shallow-blue)]/30 bg-white text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-ocean-mid)] focus:ring-4 focus:ring-[var(--color-ocean-mid)]/10 transition-all duration-300"
                      >
                        {categoryOptions.filter(o => o.value !== 'all').map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                        难度
                      </label>
                      <select
                        required
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 })}
                        className="w-full px-4 py-3 rounded-full border-2 border-[var(--color-shallow-blue)]/30 bg-white text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-ocean-mid)] focus:ring-4 focus:ring-[var(--color-ocean-mid)]/10 transition-all duration-300"
                      >
                        {difficultyOptions.filter(o => o.value !== 0).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                      例句
                    </label>
                    <textarea
                      value={formData.examples}
                      onChange={(e) => setFormData({ ...formData, examples: e.target.value })}
                      placeholder="多个例句用顿号、逗号或换行分隔"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--color-shallow-blue)]/30 bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-ocean-mid)] focus:ring-4 focus:ring-[var(--color-ocean-mid)]/10 transition-all duration-300 min-h-[100px] resize-none"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-3">
                  <Button variant="secondary" onClick={closeModals} type="button">
                    取消
                  </Button>
                  <Button variant="primary" type="submit">
                    {editingRoot ? '保存修改' : '添加词根'}
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
                    确定要删除词根{' '}
                    <span className="font-bold text-[var(--color-ocean-deep)]">
                      {deletingRoot?.character}
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

      <AnimatePresence>
        {isDetailModalOpen && viewingRoot && (
          <motion.div
            key="detail-modal"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModals} />
            <motion.div
              variants={modalVariants}
              className="relative z-10 w-full max-w-2xl"
            >
              <Card variant="ocean">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-3xl">
                        {viewingRoot.character}
                      </CardTitle>
                      <CardDescription className="text-lg">
                        {viewingRoot.pinyin} · {viewingRoot.meaning}
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
                <CardContent className="space-y-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <Badge
                      variant={getCategoryBadgeVariant(viewingRoot.category)}
                      size="lg"
                    >
                      {getCategoryLabel(viewingRoot.category)}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[var(--color-text-secondary)]">难度：</span>
                      <StarRating rating={viewingRoot.difficulty} />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-[var(--color-ocean-deep)] mb-3 flex items-center gap-2">
                      <MessageSquare size={20} className="text-[var(--color-ocean-mid)]" />
                      例句
                    </h4>
                    <ul className="space-y-2">
                      {viewingRoot.examples.map((example, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 p-3 rounded-xl bg-white/50"
                        >
                          <Check size={18} className="text-[var(--color-seaweed)] mt-0.5" />
                          <span className="text-[var(--color-text-secondary)]">
                            {example}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {relatedGrammarRules.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold text-[var(--color-ocean-deep)] mb-3 flex items-center gap-2">
                        <BookMarked size={20} className="text-[var(--color-ocean-mid)]" />
                        相关语法规则
                      </h4>
                      <ul className="space-y-3">
                        {relatedGrammarRules.map((rule) => (
                          <li
                            key={rule.id}
                            className="p-4 rounded-xl bg-white/50 border border-[var(--color-shallow-blue)]/20"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-[var(--color-ocean-deep)]">
                                {rule.name}
                              </span>
                              <Badge variant="sand" size="sm">
                                {rule.pattern}
                              </Badge>
                            </div>
                            <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                              {rule.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {rule.examples.map((example, i) => (
                                <Badge key={i} variant="secondary" size="sm">
                                  {example}
                                </Badge>
                              ))}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end gap-3">
                  <Button variant="secondary" onClick={closeModals}>
                    关闭
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      closeModals();
                      openEditModal(viewingRoot);
                    }}
                    leftIcon={<Edit2 size={16} />}
                  >
                    编辑此词根
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
