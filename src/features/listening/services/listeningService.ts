import { BaseService } from "@/shared/services/supabase/baseService";
import { Level } from "@/shared/types/common.types";
import { ListeningExercise, ListeningQuestion } from "../types/service.types";

export class ListeningService extends BaseService<ListeningExercise> {
  constructor() {
    super("listening_content");
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
