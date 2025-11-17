import { BaseService } from "@/shared/services/supabase/baseService";
import { Level } from "@/shared/types/common.types";
import { GrammarRule, GrammarExercise } from "../types/service.types";

export class GrammarService extends BaseService<GrammarRule> {
  constructor() {
    super("grammar_topics");
  }

  async getAll() {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        category:grammar_categories(*)
      `)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data as GrammarRule[];
  }

  async getRulesByLevel(level: Level) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        category:grammar_categories(*)
      `)
      .eq("level", level)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data as GrammarRule[];
  }

  async getRulesByCategory(categoryId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        category:grammar_categories(*)
      `)
      .eq("category_id", categoryId)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data as GrammarRule[];
  }
}
