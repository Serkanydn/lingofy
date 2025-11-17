import { Level } from "@/shared/types/common.types";
import { GrammarCategory } from "./category.types";

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
  category_id: string;
  category?: GrammarCategory;
  explanation: string;
  examples: string[];
  mini_text: string | null;
  level: Level;
  is_premium: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}
