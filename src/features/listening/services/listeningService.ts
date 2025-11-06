import { BaseService } from "@/shared/services/supabase/baseService";

interface ListeningExercise {
  id: number;
  title: string;
  audio_url: string;
  transcript: string;
  level: string;
  duration: number;
  category: string;
  questions: ListeningQuestion[];
  created_at: string;
  updated_at: string;
}

interface ListeningQuestion {
  id: number;
  exercise_id: number;
  question: string;
  options: string[];
  correct_answer: string;
  time_stamp?: number;
}

export class ListeningService extends BaseService<ListeningExercise> {
  private questionsService: BaseService<ListeningQuestion>;

  constructor() {
    super("listening_exercises");
    this.questionsService = new BaseService<ListeningQuestion>("listening_questions");
  }

  async getExerciseWithQuestions(exerciseId: number) {
    const exercise = await this.getById(exerciseId);
    const { data: questions, error } = await this.supabase
      .from("listening_questions")
      .select("*")
      .eq("exercise_id", exerciseId);

    if (error) throw error;
    return { ...exercise, questions };
  }

  async getExercisesByLevel(level: string) {
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