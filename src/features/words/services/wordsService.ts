import { BaseService } from "@/shared/services/supabase/baseService";

interface UserWord {
  id: string;
  user_id: string;
  word: string;
  translation: string;
  description: string;
  example_sentences: string[];
  audio_url?: string;
  source_type?: "reading" | "listening";
  source_id?: string;
  created_at: string;
}

export class WordsService extends BaseService<UserWord> {
  constructor() {
    super("user_words");
  }

  async addWord(userId: string, word: Omit<UserWord, "id" | "user_id" | "created_at">) {
    return this.create({
      ...word,
      user_id: userId,
    });
  }

  async getUserWords(userId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as UserWord[];
  }

  async deleteWord(id: string, userId: string) {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
  }
}