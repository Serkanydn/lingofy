import { z } from "zod";
import { CEFRLevel } from "@/shared/types/enums/cefrLevel.enum";
import { QuestionFormData } from "../../../shared/types/questionValidation";

export const listeningSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters")
    .trim(),
  level: z.enum(CEFRLevel),
  transcript: z
    .string()
    .min(20, "Transcript must be at least 20 characters")
    .trim(),
  duration_seconds: z
    .number()
    .int("Duration must be an integer")
    .positive("Duration must be greater than 0")
    .max(3600, "Duration must not exceed 1 hour (3600 seconds)"),
  is_premium: z.boolean(),
  order: z
    .number()
    .int("Order must be an integer")
    .positive("Order must be greater than 0"),
  audio_asset_id: z.string().uuid().optional(),
});

export type ListeningFormData = Omit<
  z.infer<typeof listeningSchema>,
  "questions"
> & {
  questions?: QuestionFormData[];
};
