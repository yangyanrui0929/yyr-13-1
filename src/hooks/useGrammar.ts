import { useMemo } from 'react';
import { validateSentenceStructure } from '@/data/grammar';
import { useAppStore } from '@/store';
import { ValidationResult } from '@/types';

export const useGrammar = () => {
  const { roots, grammarRules } = useAppStore();

  const validate = useMemo(() => {
    return (rootIds: string[]): ValidationResult => {
      const rootData = rootIds.map(id => roots.find(r => r.id === id)).filter(Boolean);
      const result = validateSentenceStructure(rootIds, roots);
      
      const errors = [...result.errors];
      const suggestions: string[] = [];
      
      if (!result.valid && result.matchedRule) {
        suggestions.push(`试试这个句式："${result.matchedRule.pattern}"`);
        suggestions.push(`例如：${result.matchedRule.examples[0]}`);
      }
      
      if (rootIds.length > 0) {
        const categories = rootData.map(r => r?.category).join(' + ');
        suggestions.push(`当前词性组合：${categories}`);
      }
      
      return {
        valid: result.valid,
        errors,
        suggestions,
      };
    };
  }, [roots]);

  const getRuleSuggestions = useMemo(() => {
    return (rootIds: string[]) => {
      const result = validateSentenceStructure(rootIds, roots);
      return result.matchedRule ? [result.matchedRule] : grammarRules.slice(0, 3);
    };
  }, [roots, grammarRules]);

  return {
    validate,
    getRuleSuggestions,
    grammarRules,
  };
};
