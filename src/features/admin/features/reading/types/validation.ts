import { z } from "zod";

// Level schema
export const levelSchema = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]);

// Question type schema
export const questionTypeSchema = z.enum([
  "multiple_choice",
  "fill_blank",
  "true_false",
]);

// Reading Text schemas
export const readingTextSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters")
    .trim(),
  level: levelSchema,
  content: z.string().min(50, "Content must be at least 50 characters").trim(),
  is_premium: z.boolean(),
  order_index: z
    .number()
    .int("Order must be an integer")
    .positive("Order must be greater than 0"),
  audio_url: z.string().url().optional().or(z.literal("")),
  audio_asset_id: z.string().uuid().optional(),
  content_id: z.string().uuid().optional(),
  updated_at: z.string().datetime().optional(),
});

export const createReadingTextSchema = readingTextSchema;

export const updateReadingTextSchema = readingTextSchema.partial().extend({
  id: z.string().uuid(),
});

// Question option schema
export const questionOptionSchema = z.object({
  text: z.string().min(1, "Option text is required").trim(),
  is_correct: z.boolean(),
});

// Question schema with discriminated union
export const baseQuestionSchema = z.object({
  id: z.string().uuid().optional(),
  text: z.string().min(10, "Question must be at least 10 characters").trim(),
  points: z
    .number()
    .int("Points must be an integer")
    .positive("Points must be greater than 0")
    .max(100, "Points must not exceed 100"),
  order_index: z
    .number()
    .int("Order must be an integer")
    .nonnegative("Order must be 0 or greater"),
});

export const multipleChoiceQuestionSchema = baseQuestionSchema.extend({
  type: z.literal("multiple_choice"),
  options: z
    .array(questionOptionSchema)
    .min(2, "At least 2 options are required")
    .max(6, "Maximum 6 options allowed")
    .refine((options) => options.filter((opt) => opt.is_correct).length === 1, {
      message: "Exactly one option must be marked as correct",
    }),
});

export const fillBlankQuestionSchema = baseQuestionSchema.extend({
  type: z.literal("fill_blank"),
  correct_answer: z.string().min(1, "Correct answer is required").trim(),
  options: z.array(questionOptionSchema).length(0).optional(),
});

export const trueFalseQuestionSchema = baseQuestionSchema.extend({
  type: z.literal("true_false"),
  options: z
    .array(questionOptionSchema)
    .length(2, "True/False questions must have exactly 2 options")
    .refine((options) => options.filter((opt) => opt.is_correct).length === 1, {
      message: "Exactly one option must be marked as correct",
    }),
});

export const questionSchema = z.discriminatedUnion("type", [
  multipleChoiceQuestionSchema,
  fillBlankQuestionSchema,
  trueFalseQuestionSchema,
]);

// Form schema with questions
export const readingFormSchema = readingTextSchema.extend({
  questions: z.array(questionSchema).optional(),
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
      content_type: z.enum(["reading", "listening", "pronunciation", "general"]).optional(),
      language: z.string().optional(),
      storage_provider: z.string().optional(),
      storage_bucket: z.string().optional(),
      storage_path: z.string().optional(),
      is_optimized: z.boolean().optional(),
      is_active: z.boolean().optional(),
      created_at: z.any().optional(),
      updated_at: z.any().optional(),
    })
    .optional(),
});

// Type exports
export type ReadingTextFormData = z.infer<typeof readingTextSchema>;
export type CreateReadingTextFormData = z.infer<typeof createReadingTextSchema>;
export type UpdateReadingTextFormData = z.infer<typeof updateReadingTextSchema>;

export type QuestionType = z.infer<typeof questionTypeSchema>;
export type QuestionOption = z.infer<typeof questionOptionSchema>;
export type QuestionFormData = z.infer<typeof questionSchema>;
export type MultipleChoiceQuestion = z.infer<
  typeof multipleChoiceQuestionSchema
>;
export type FillBlankQuestion = z.infer<typeof fillBlankQuestionSchema>;
export type TrueFalseQuestion = z.infer<typeof trueFalseQuestionSchema>;

export type ReadingFormData = z.infer<typeof readingFormSchema>;
