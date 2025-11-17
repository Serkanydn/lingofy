import { BaseService } from "@/shared/services/supabase/baseService";
import {
  ReadingText,
  ReadingQuestion,
  ReadingQuestionInput,
} from "../types/service.types";
import type { Level } from "@/shared/types/common.types";

export class ReadingService extends BaseService<ReadingText> {
  private questionsService: BaseService<ReadingQuestion>;

  constructor() {
    super("reading_content");
    this.questionsService = new BaseService<ReadingQuestion>("reading_quiz");
  }

  // Override getAll to include audio assets
  async getAll(): Promise<ReadingText[]> {
    const { data, error } = await this.supabase.from(this.tableName).select(`
        *,
        audio_asset:audio_assets(*)
      `);

    if (error) throw error;
    return data as ReadingText[];
  }

  // Override getById to include audio assets
  async getById(id: string | number): Promise<ReadingText | null> {
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
    return data as ReadingText;
  }

  async createQuestions(readingId: string, questions: ReadingQuestionInput[]) {
    if (questions.length === 0) return [];

    console.log("Creating questions:", questions);

    // Create questions directly linked to reading_content id
    const questionsToInsert = questions.map((q) => ({
      content_id: readingId, // Link directly to reading_content
      text: q.text,
      type: q.type,
      points: q.points,
      order_index: q.order_index,
      correct_answer: q.type === "fill_blank" ? q.correct_answer : null, // Store correct answer for fill_blank
    }));

    console.log("Questions to insert:", questionsToInsert);

    const { data: insertedQuestions, error: questionsError } =
      await this.supabase.from("questions").insert(questionsToInsert).select();

    if (questionsError) throw questionsError;

    console.log("Inserted questions:", insertedQuestions);

    // Insert options for multiple_choice and true_false questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const insertedQuestion = insertedQuestions[i];

      if (question.type !== "fill_blank" && question.options.length > 0) {
        const optionsToInsert = question.options.map((opt) => ({
          question_id: insertedQuestion.id,
          text: opt.text,
          is_correct: opt.is_correct,
        }));

        const { error: optionsError } = await this.supabase
          .from("question_options")
          .insert(optionsToInsert);

        if (optionsError) throw optionsError;
      }
    }

    return insertedQuestions;
  }

  async getQuestionsForContent(readingId: string): Promise<any[]> {
    const { data: questions, error } = await this.supabase
      .from("questions")
      .select(
        `
        *,
        options:question_options(*)
      `
      )
      .eq("content_id", readingId) // Use reading_content id directly
      .order("order_index", { ascending: true });

    if (error) throw error;

    // Transform to match Question interface
    return (questions || []).map((q: any) => ({
      id: q.id,
      text: q.text,
      type: q.type,
      options:
        q.options?.map((opt: any) => ({
          text: opt.text,
          is_correct: opt.is_correct,
        })) || [],
      correct_answer: q.correct_answer,
      points: q.points || 10,
      order_index: q.order_index,
    }));
  }

  async updateQuestions(readingId: string, questions: ReadingQuestionInput[]) {
    // Delete existing questions and their options
    const { data: existingQuestions } = await this.supabase
      .from("questions")
      .select("id")
      .eq("content_id", readingId); // Use reading_content id directly

    if (existingQuestions && existingQuestions.length > 0) {
      const questionIds = existingQuestions.map((q) => q.id);

      // Delete options first (due to foreign key)
      await this.supabase
        .from("question_options")
        .delete()
        .in("question_id", questionIds);

      // Delete questions
      await this.supabase
        .from("questions")
        .delete()
        .eq("content_id", readingId);
    }

    // Create new questions
    if (questions.length > 0) {
      return await this.createQuestions(readingId, questions);
    }
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
        *
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
