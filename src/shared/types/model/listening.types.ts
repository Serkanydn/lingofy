import { AudioAsset } from "./audio.types";
import { BaseEntity } from "./base.type";
import { CEFRLevel } from "../enums/cefrLevel.enum";

export interface ListeningQuestion {
  id: string;
  content_id: string;
  question: string;
  options: string[];
  correct_answer: string;
  time_stamp?: number;
}

export interface ListeningContent extends BaseEntity {
  title: string;
  level: CEFRLevel;
  duration_seconds: number;
  transcript: string | null;
  is_premium: boolean;
  order: number | null;
  audio_asset_id: string | null;
  category?: any;
}

export interface ListeningContentWithAudio
  extends BaseEntity,
    ListeningContent {
  audio_asset?: AudioAsset;
}
