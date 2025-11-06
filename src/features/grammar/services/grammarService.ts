import { BaseService } from "@/shared/services/supabase/baseService";

import { Level, GrammarCategory } from '@/shared/types/common.types';

interface GrammarRule {
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

interface GrammarExercise {
  id: number;
  rule_id: number;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  difficulty: string;
}

export class GrammarService extends BaseService<GrammarRule> {
  private exercisesService: BaseService<GrammarExercise>;

  constructor() {
    super("grammar_rules");
    this.exercisesService = new BaseService<GrammarExercise>("grammar_exercises");
  }

  async getRuleWithExercises(ruleId: string) {
    const rule = await this.getById(ruleId);
    const { data: exercises, error } = await this.supabase
      .from("grammar_exercises")
      .select("*")
      .eq("rule_id", ruleId);

    if (error) throw error;
    return { rule, exercises };
  }

  async getRulesByLevel(level: Level) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("difficulty_level", level);

    if (error) throw error;
    return data as GrammarRule[];
  }

  async getRulesByCategory(category: GrammarCategory) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("category", category);

    if (error) throw error;
    return data as GrammarRule[];
  }
}