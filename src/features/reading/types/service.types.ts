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
  quiz_content_id: string;
  title: string;
  content: string;
  level: Level;
  word_count: number;
  audio_url: string
  is_premium: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

import { Level } from '@/shared/types/common.types';