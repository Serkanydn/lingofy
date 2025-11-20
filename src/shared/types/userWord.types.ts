import { BaseEntity } from "./model/base.type";

export interface UserWord extends BaseEntity {
  user_id: string;
  word: string;
  source_type?: "reading" | "listening";
  source_id?: string;
  category_id?: string | null;
  description: string;
  example_sentences: string[];
}

export interface UserWordCategory extends BaseEntity {
  user_id: string;
  name: string;
  color: string;
  order: number;
  icon?: string | null;
}
