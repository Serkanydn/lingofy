import { BaseService } from "@/shared/services/supabase/baseService";

interface ReadingText {
  id: number;
  title: string;
  content: string;
  level: string;
  category: string;
  estimated_time: number;
  vocabulary: string[];
  created_at: string;
  updated_at: string;
}

interface ReadingQuestion {
  id: number;
  text_id: number;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export class ReadingService extends BaseService<ReadingText> {
  private questionsService: BaseService<ReadingQuestion>;

  constructor() {
    super("reading_texts");
    this.questionsService = new BaseService<ReadingQuestion>("reading_questions");
  }

  async getTextWithQuestions(textId: number) {
    const text = await this.getById(textId);
    const { data: questions, error } = await this.supabase
      .from("reading_questions")
      .select("*")
      .eq("text_id", textId);

    if (error) throw error;
    return { ...text, questions };
  }

  async getTextsByLevel(level: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("level", level);

    if (error) throw error;
    return data as ReadingText[];
  }

  async getTextsByCategory(category: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("category", category);

    if (error) throw error;
    return data as ReadingText[];
  }

  async searchTexts(query: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .textSearch("title", query);

    if (error) throw error;
    return data as ReadingText[];
  }
}