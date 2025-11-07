import { BaseService } from "@/shared/services/supabase/baseService";
import { Level, GrammarCategory } from '@/shared/types/common.types';
import { GrammarRule, GrammarExercise } from '../types/service.types';

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