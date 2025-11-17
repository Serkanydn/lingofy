export interface AudioAsset {
  id: string;
  storage_url: string;
  original_filename?: string;
  file_size_bytes?: number;
  duration_seconds?: number;
  format?: 'mp3' | 'wav' | 'ogg' | 'm4a';
  bitrate?: number;
  sample_rate?: number;
  content_type?: 'reading' | 'listening' | 'pronunciation' | 'general';
  language?: string;
  storage_provider?: string;
  storage_bucket?: string;
  storage_path?: string;
  cdn_url?: string;
  is_optimized?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ReadingContentWithAudio {
  id: string;
  title: string;
  level: string;
  content: string;
  audio_asset_id?: string;
  audio_asset?: AudioAsset;
  is_premium: boolean;
  order_index?: number;
  created_at: string;
  updated_at: string;
}

export interface ListeningContentWithAudio {
  id: string;
  title: string;
  level: string;
  description?: string;
  audio_asset_id?: string;
  audio_asset?: AudioAsset;
  duration_seconds?: number;
  transcript?: string;
  is_premium: boolean;
  order_index?: number;
  created_at: string;
  updated_at: string;
}
