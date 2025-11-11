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
