import { AudioContentType } from "../enums/audioContentType.enum.";
import { AudioFormat } from "../enums/audioFormat.enum";
import { BaseEntity } from "./base.type";

export interface AudioAsset extends BaseEntity {
  storage_url: string;
  original_filename: string | null;
  file_size_bytes: number | null;
  duration_seconds: number | null;
  format: AudioFormat | null;
  bitrate: number | null;
  sample_rate: number | null;
  content_type: AudioContentType | null;
  language: string;
  storage_provider: string;
  storage_bucket: string | null;
  storage_path: string | null;
  cdn_url: string | null;
  is_optimized: boolean;
  is_active: boolean;
}




