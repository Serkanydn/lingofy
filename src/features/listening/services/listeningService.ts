import { BaseService } from "@/shared/services/supabase/baseService";
import { Level } from '@/shared/types/common.types';
import { ListeningExercise, ListeningQuestion } from '../types/service.types';

export class ListeningService extends BaseService<ListeningExercise> {
  private questionsService: BaseService<ListeningQuestion>;

  constructor() {
    super("listening_exercises");
    this.questionsService = new BaseService<ListeningQuestion>("listening_questions");
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

  async getExercisesByLevel(level: Level) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("level", level);

    if (error) throw error;
    return data as ListeningExercise[];
  }

  async getExercisesByCategory(category: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("category", category);

    if (error) throw error;
    return data as ListeningExercise[];
  }
}