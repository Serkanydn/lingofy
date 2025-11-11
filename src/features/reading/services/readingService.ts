import { BaseService } from "@/shared/services/supabase/baseService";
import { ReadingText, ReadingQuestion } from "../types/service.types";
import type { Level } from "@/shared/types/common.types";

export class ReadingService extends BaseService<ReadingText> {
  private questionsService: BaseService<ReadingQuestion>;

  constructor() {
    super("reading_content");
    this.questionsService = new BaseService<ReadingQuestion>("reading_quiz");
  }

  async getTextWithQuestions(textId: string) {
    const text = await this.getById(textId);
    const { data: questions, error } = await this.supabase
      .from("reading_quiz")
      .select("*")
      .eq("content_id", textId);

    if (error) throw error;
    return { ...text, questions };
  }

  async getReadingDetailById(id: string | number): Promise<ReadingText | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(
        `
        *,
        audio_asset:audio_assets(*)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async getTextsByLevel(level: Level) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(
        `
        *,
        audio_asset:audio_assets(*)
      `
      )
      .eq("level", level);

    if (error) throw error;
    return data as ReadingText[];
  }

  async getTextCountByLevel(level: Level) {
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select("*", { count: "exact", head: true })
      .eq("level", level);

    if (error) throw error;
    return count;
  }

  async getTextsByCategory(category: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(
        `
        *,
        audio_asset:audio_assets(*)
      `
      )
      .eq("category", category);

    if (error) throw error;
    return data as ReadingText[];
  }

  async searchTexts(query: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(
        `
        *,
        audio_asset:audio_assets(*)
      `
      )
      .textSearch("title", query);

    if (error) throw error;
    return data as ReadingText[];
  }
}
