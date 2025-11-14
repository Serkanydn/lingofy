import { z } from "zod";

// Level schema
export const levelSchema = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]);

// Question type schema
export const questionTypeSchema = z.enum([
  "multiple_choice",
  "fill_blank",
  "true_false",
]);

// Listening Exercise schemas
export const listeningExerciseSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters")
    .trim(),
  level: levelSchema,
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters")
    .trim(),
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
  order_index: z
    .number()
    .int("Order must be an integer")
    .positive("Order must be greater than 0"),
  audio_asset_id: z.string().uuid().optional(),
  updated_at: z.string().datetime().optional(),
});

export const createListeningExerciseSchema = listeningExerciseSchema;

export const updateListeningExerciseSchema = listeningExerciseSchema.partial().extend({
  id: z.string().uuid(),
});

// Question option schema
export const questionOptionSchema = z.object({
  text: z
    .string()
    .min(1, "Option text is required")
    .trim(),
  is_correct: z.boolean(),
});

// Question schema with discriminated union
export const baseQuestionSchema = z.object({
  id: z.string().uuid().optional(),
  text: z
    .string()
    .min(10, "Question must be at least 10 characters")
    .trim(),
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
    .refine(
      (options) => options.filter((opt) => opt.is_correct).length === 1,
      {
        message: "Exactly one option must be marked as correct",
      }
    ),
});

export const fillBlankQuestionSchema = baseQuestionSchema.extend({
  type: z.literal("fill_blank"),
  correct_answer: z
    .string()
    .min(1, "Correct answer is required")
    .trim(),
  options: z.array(questionOptionSchema).length(0).optional(),
});

export const trueFalseQuestionSchema = baseQuestionSchema.extend({
  type: z.literal("true_false"),
  options: z
    .array(questionOptionSchema)
    .length(2, "True/False questions must have exactly 2 options")
    .refine(
      (options) => options.filter((opt) => opt.is_correct).length === 1,
      {
        message: "Exactly one option must be marked as correct",
      }
    ),
});

export const questionSchema = z.discriminatedUnion("type", [
  multipleChoiceQuestionSchema,
  fillBlankQuestionSchema,
  trueFalseQuestionSchema,
]);

// Form schema with questions
export const listeningFormSchema = listeningExerciseSchema.extend({
  questions: z.array(questionSchema).optional(),
});

// Type exports
export type ListeningExerciseFormData = z.infer<typeof listeningExerciseSchema>;
export type CreateListeningExerciseFormData = z.infer<typeof createListeningExerciseSchema>;
export type UpdateListeningExerciseFormData = z.infer<typeof updateListeningExerciseSchema>;

export type QuestionType = z.infer<typeof questionTypeSchema>;
export type QuestionOption = z.infer<typeof questionOptionSchema>;
export type QuestionFormData = z.infer<typeof questionSchema>;
export type MultipleChoiceQuestion = z.infer<typeof multipleChoiceQuestionSchema>;
export type FillBlankQuestion = z.infer<typeof fillBlankQuestionSchema>;
export type TrueFalseQuestion = z.infer<typeof trueFalseQuestionSchema>;

export type ListeningFormData = z.infer<typeof listeningFormSchema>;
