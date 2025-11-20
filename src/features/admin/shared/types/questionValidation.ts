import { z } from "zod";
import { QuestionType } from "@/shared/types/enums/question.enum";

const baseQuestionSchema = z.object({
  id: z.string().uuid().optional(),
  content_id: z.string().uuid(),
  text: z.string().min(10, "Question must be at least 10 characters").trim(),
  points: z
    .number()
    .int("Points must be an integer")
    .positive("Points must be greater than 0")
    .max(100, "Points must not exceed 100"),
  order: z
    .number()
    .int("Order must be an integer")
    .nonnegative("Order must be 0 or greater"),
});

const questionOptionSchema = z.object({
  text: z.string().min(1, "Option text is required").trim(),
  is_correct: z.boolean(),
});

const multipleChoiceQuestionSchema = baseQuestionSchema.extend({
  type: z.literal(QuestionType.MULTIPLE_CHOICE),
  options: z
    .array(questionOptionSchema)
    .min(2, "At least 2 options are required")
    .max(6, "Maximum 6 options allowed")
    .refine((options) => options.filter((opt) => opt.is_correct).length === 1, {
      message: "Exactly one option must be marked as correct",
    }),
});

const fillBlankQuestionSchema = baseQuestionSchema.extend({
  type: z.literal(QuestionType.FILL_BLANK),
  correct_answer: z.string().min(1, "Correct answer is required").trim(),
  options: z.array(questionOptionSchema).length(0),
});

const trueFalseQuestionSchema = baseQuestionSchema.extend({
  type: z.literal(QuestionType.TRUE_FALSE),
  options: z
    .array(questionOptionSchema)
    .length(2, "True/False questions must have exactly 2 options")
    .refine((options) => options.filter((opt) => opt.is_correct).length === 1, {
      message: "Exactly one option must be marked as correct",
    }),
});

type QuestionOption = z.infer<typeof questionOptionSchema>;

type MultipleChoiceQuestion = z.infer<typeof multipleChoiceQuestionSchema>;
type FillBlankQuestion = z.infer<typeof fillBlankQuestionSchema>;
type TrueFalseQuestion = z.infer<typeof trueFalseQuestionSchema>;

export const questionSchema = z.discriminatedUnion("type", [
  multipleChoiceQuestionSchema,
  fillBlankQuestionSchema,
  trueFalseQuestionSchema,
]);

export type QuestionFormData = z.infer<typeof questionSchema>;
