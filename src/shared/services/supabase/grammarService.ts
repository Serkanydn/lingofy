import { BaseService } from "@/shared/services/supabase/baseService";
import { CEFRLevel } from "@/shared/types/enums/cefrLevel.enum";
import { GrammarTopic } from "@/shared/types/model/grammarTopic.types";

class GrammarService extends BaseService<GrammarTopic> {
  constructor() {
    super("grammar_topics");
  }

  async getAll() {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(
        `
        *,
        category:grammar_categories(*)
      `
      )
      .order("order", { ascending: true });

    if (error) throw error;
    return data as GrammarTopic[];
  }

  async getRulesByLevel(level: CEFRLevel) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(
        `
        *,
        category:grammar_categories(*)
      `
      )
      .eq("level", level)
      .order("order", { ascending: true });

    if (error) throw error;
    return data as GrammarTopic[];
  }

  async getRulesByCategory(categoryId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(
        `
        *,
        category:grammar_categories(*)
      `
      )
      .eq("category_id", categoryId)
      .order("order", { ascending: true });

    if (error) throw error;
    return data as GrammarTopic[];
  }
}

export const grammarService = new GrammarService();
