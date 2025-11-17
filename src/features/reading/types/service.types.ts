export interface ReadingQuestion {
  id: number;
  text_id: number;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface ReadingQuestionInput {
  text: string;
  type: "multiple_choice" | "fill_blank" | "true_false";
  options: { text: string; is_correct: boolean }[];
  correct_answer?: string;
  points: number;
  order_index: number;
}

export interface ReadingText {
  id: string;
  content_id?: string;
  title: string;
  content: string;
  level: Level;
  audio_asset_id?: string;
  audio_asset?: AudioAsset;
  is_premium: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  category?: string;
  image_url?: string;
}

import { AudioAsset } from "@/shared/types/audio.types";
import { Level } from "@/shared/types/common.types";
