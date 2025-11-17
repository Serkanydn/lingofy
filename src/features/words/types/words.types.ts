export interface UserWord {
  id: string;
  word: string;
  description: string;
  example_sentences: string[];
  source_type?: "reading" | "listening";
  source_id?: string;
  category_id?: string | null;
  created_at: string;
}

export interface WordCategory {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon?: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type SortOption = "a-z" | "z-a" | "newest" | "oldest";
