export interface GrammarExercise {
  id: number;
  rule_id: number;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  difficulty: string;
}

export interface GrammarRule {
  id: string;
  title: string;
  category: GrammarCategory;
  explanation: string;
  examples: string[];
  mini_text: string;
  difficulty_level: Level;
  is_premium: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

import { Level, GrammarCategory } from '@/shared/types/common.types';