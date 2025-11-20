import { QuestionFormData } from "@/features/admin/shared/types/questionValidation";
import { AudioContentType } from "@/shared/types/enums/audioContentType.enum.";
import { CEFRLevel } from "@/shared/types/enums/cefrLevel.enum";
import { z } from "zod";

export const readingTextSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters")
    .trim(),
  level: z.enum(CEFRLevel),
  content: z.string().min(50, "Content must be at least 50 characters").trim(),
  is_premium: z.boolean(),
  order: z
    .number()
    .int("Order must be an integer")
    .positive("Order must be greater than 0"),
  audio_asset_id: z.string().uuid().optional(),
  updated_at: z.string().datetime().optional(),
});

export const readingFormSchema = readingTextSchema.extend({
  audio_asset: z
    .object({
      id: z.string().uuid(),
      storage_url: z.string().url().optional(),
      cdn_url: z.string().url().optional(),
      original_filename: z.string().optional(),
      file_size_bytes: z.number().int().positive().optional(),
      duration_seconds: z.any().optional(),
      format: z.enum(["mp3", "wav", "ogg", "m4a"]).optional(),
      bitrate: z.any().optional(),
      sample_rate: z.any().optional(),
      content_type: z.enum(AudioContentType).optional(),
      language: z.string().optional(),
      storage_provider: z.string().optional(),
      storage_bucket: z.string().optional(),
      storage_path: z.string().optional(),
      is_optimized: z.boolean().optional(),
      is_active: z.boolean().optional(),
    })
    .optional(),
});

export type ReadingFormData = Omit<
  z.infer<typeof readingFormSchema>,
  "questions"
> & {
  questions?: QuestionFormData[];
};
