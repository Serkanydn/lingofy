export interface ReadingQuestion {
  id: number;
  text_id: number;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface ReadingText {
  id: string;
  content_id?: string;
  title: string;
  content: string;
  level: Level;
  audio_url: string;
  is_premium: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  category?: string;
  image_url?: string;
}

import { Level } from "@/shared/types/common.types";
