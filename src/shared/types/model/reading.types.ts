import { AudioAsset } from "./audio.types";
import { BaseEntity } from "./base.type";
import { CEFRLevel } from "../enums/cefrLevel.enum";

export type ReadingFilters = {
  level?: CEFRLevel;
  search?: string;
  isPremium?: boolean;
};

export type ReadingStats = {
  totalReadings: number;
  completedReadings: number;
  averageScore: number;
  timeSpent: number;
  level: CEFRLevel;
};

export interface ReadingContent extends BaseEntity {
  title: string;
  level: CEFRLevel;
  content: string;
  is_premium: boolean;
  order: number | null;
  audio_asset_id: string | null;
}

export interface ReadingContentWithAudio extends BaseEntity, ReadingContent {
  audio_asset?: AudioAsset;
}
