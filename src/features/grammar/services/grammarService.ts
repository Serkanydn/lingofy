import { BaseService } from "@/shared/services/supabase/baseService";

interface GrammarRule {
  id: number;
  title: string;
  description: string;
  level: string;
  examples: string[];
  category: string;
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

  async getRuleWithExercises(ruleId: number) {
    const rule = await this.getById(ruleId);
    const { data: exercises, error } = await this.supabase
      .from("grammar_exercises")
      .select("*")
      .eq("rule_id", ruleId);

    if (error) throw error;
    return { rule, exercises };
  }

  async getRulesByLevel(level: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("level", level);

    if (error) throw error;
    return data as GrammarRule[];
  }

  async getRulesByCategory(category: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("category", category);

    if (error) throw error;
    return data as GrammarRule[];
  }
}