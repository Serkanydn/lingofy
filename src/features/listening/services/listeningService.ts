import { BaseService } from "@/shared/services/supabase/baseService";
import { Level } from "@/shared/types/common.types";
import { ListeningExercise, ListeningQuestion } from "../types/service.types";
import { ReadingQuestionInput } from "@/features/reading/types/service.types";

export class ListeningService extends BaseService<ListeningExercise> {
  constructor() {
    super("listening_content");
  }

  // Override getAll to include audio assets
  async getAll(): Promise<ListeningExercise[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        audio_asset:audio_assets(*)
      `);

    if (error) throw error;
    return data as ListeningExercise[];
  }

  // Override getById to include audio assets
  async getById(id: string | number): Promise<ListeningExercise | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        audio_asset:audio_assets(*)
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as ListeningExercise;
  }

  async getExerciseWithQuestions(exerciseId: string) {
    const exercise = await this.getById(exerciseId);
    const { data: questions, error } = await this.supabase
      .from("listening_questions")
      .select("*")
      .eq("content_id", exerciseId);

    if (error) throw error;
    return { ...exercise, questions };
  }

  async createQuestions(listeningId: string, questions: ReadingQuestionInput[]) {
    if (questions.length === 0) return [];

    console.log('Creating listening questions:', questions);

    // Create questions directly linked to listening_content id
    const questionsToInsert = questions.map((q) => ({
      content_id: listeningId, // Link directly to listening_content
      text: q.text,
      type: q.type,
      points: q.points,
      order_index: q.order_index,
      correct_answer: q.type === 'fill_blank' ? q.correct_answer : null,
    }));

    console.log('Listening questions to insert:', questionsToInsert);

    const { data: insertedQuestions, error: questionsError } = await this.supabase
      .from("questions")
      .insert(questionsToInsert)
      .select();

    if (questionsError) throw questionsError;

    console.log('Inserted listening questions:', insertedQuestions);

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

  async getQuestionsForContent(listeningId: string): Promise<any[]> {
    const { data: questions, error } = await this.supabase
      .from("questions")
      .select(`
        *,
        options:question_options(*)
      `)
      .eq("content_id", listeningId) // Use listening_content id directly
      .order("order_index", { ascending: true });

    if (error) throw error;

    // Transform to match Question interface
    return (questions || []).map((q: any) => ({
      id: q.id,
      text: q.text,
      type: q.type,
      options: q.options?.map((opt: any) => ({
        text: opt.text,
        is_correct: opt.is_correct,
      })) || [],
      correct_answer: q.correct_answer,
      points: q.points || 10,
      order_index: q.order_index,
    }));
  }

  async updateQuestions(listeningId: string, questions: ReadingQuestionInput[]) {
    // Delete existing questions for this listening content
    const { error: deleteError } = await this.supabase
      .from("questions")
      .delete()
      .eq("content_id", listeningId);

    if (deleteError) throw deleteError;

    // Create new questions if provided
    if (questions.length > 0) {
      return await this.createQuestions(listeningId, questions);
    }

    return [];
  }

  async getExercisesByLevel(level: Level) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        audio_asset:audio_assets(*)
      `)
      .eq("level", level);

    if (error) throw error;
    return data as ListeningExercise[];
  }

  async getExercisesByCategory(category: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        audio_asset:audio_assets(*)
      `)
      .eq("category", category);

    if (error) throw error;
    return data as ListeningExercise[];
  }
}
