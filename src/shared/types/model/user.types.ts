import { ContentType } from "../enums/contentType.enum";
import { BaseEntity } from "./base.type";
import { QuizAnswer } from "./question.types";

export interface UserProfile extends BaseEntity {
  email: string;
  full_name: string | null;
  is_premium: boolean;
  premium_expires_at: string | null;
  lemon_squeezy_customer_id: string | null;
  lemon_squeezy_subscription_id: string | null;
  is_admin: boolean;
}

export interface UserQuestionAttempt extends BaseEntity {
  id: string;
  user_id: string;
  content_id: string;
  answers: QuizAnswer[];
  // answers: Record<string, any>; // jsonb
  score: number;
  max_score: number;
  percentage: number;
  completed_at: string;
}

export interface UserStatistics {
  user_id: string;
  total_reading_completed: number;
  total_listening_completed: number;
  total_quizzes_completed: number;
  total_quiz_score: number;
  total_words_added: number;
  flashcard_practice_count: number;
  total_usage_days: number;
  last_activity_date: string | null;
  most_studied_level: string | null;
  updated_at: string;
  total_grammar_completed: number;
}

export interface UserWordCategory extends BaseEntity {
  user_id: string;
  name: string;
  color: string;
  icon: string;
  order: number;
}

export interface UserWord extends BaseEntity {
  user_id: string;
  word: string;
  source_type?: ContentType;
  source_id?: string;
  category_id?: string | null;
  description: string;
  example_sentences: string[];
}


export interface UpdateUserInput {
  full_name?: string;
  is_premium?: boolean;
  premium_expires_at?: string | null;
}