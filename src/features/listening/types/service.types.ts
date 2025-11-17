import { Level } from "@/shared/types/common.types";

export interface ListeningExercise {
  id: string;
  title: string;
  description: string;
  audio_asset_id?: string;
  category?: string;
  audio_asset?: {
    id: string;
    storage_url: string;
    cdn_url?: string;
    duration_seconds?: number;
    format?: string;
  };
  transcript: string;
  level: Level;
  duration_seconds: number;
  is_premium: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ListeningQuestion {
  id: string;
  content_id: string;
  question: string;
  options: string[];
  correct_answer: string;
  time_stamp?: number;
}
