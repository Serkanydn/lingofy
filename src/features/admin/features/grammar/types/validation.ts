import { z } from "zod";

// Level schema
export const levelSchema = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]);

// Grammar Category schemas
export const grammarCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug must not exceed 100 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .trim(),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .nullable()
    .optional(),
  icon: z
    .string()
    .min(1, "Icon is required")
    .max(2, "Icon must be a single emoji"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color (e.g., #3b82f6)"),
  order_index: z
    .number()
    .int("Order must be an integer")
    .nonnegative("Order must be 0 or greater"),
  is_active: z.boolean(),
});

export const createGrammarCategorySchema = grammarCategorySchema;

export const updateGrammarCategorySchema = grammarCategorySchema.partial();

// Grammar Topic schemas
export const grammarTopicSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters")
    .trim(),
  category_id: z
    .string()
    .trim()
    .uuid("Invalid category ID")
    .min(1, "Category is required"),
  difficulty_level: levelSchema,
  explanation: z
    .string()
    .min(10, "Explanation must be at least 10 characters")
    .trim(),
  mini_text: z
    .string()
    .min(10, "Mini text must be at least 10 characters")
    .trim(),
  examples: z
    .array(z.string().trim().min(1, "Example cannot be empty"))
    .min(1, "At least one example is required")
    .max(10, "Maximum 10 examples allowed"),
  order_index: z
    .number()
    .int("Order must be an integer")
    .positive("Order must be greater than 0"),
  is_premium: z.boolean(),
  content_id: z.string().uuid().optional(),
  updated_at: z.string().datetime().optional(),
});

export const createGrammarTopicSchema = grammarTopicSchema;

export const updateGrammarTopicSchema = grammarTopicSchema.partial().extend({
  id: z.string().uuid(),
});

// Grammar Question schemas
export const grammarQuestionOptionSchema = z.object({
  text: z
    .string()
    .min(1, "Option text is required")
    .trim(),
  is_correct: z.boolean(),
});

export const grammarQuestionSchema = z.object({
  question: z
    .string()
    .min(10, "Question must be at least 10 characters")
    .trim(),
  options: z
    .array(z.string().trim().min(1, "Option cannot be empty"))
    .min(2, "At least 2 options are required")
    .max(6, "Maximum 6 options allowed"),
  correct_answer: z
    .string()
    .min(1, "Correct answer is required")
    .trim(),
  explanation: z
    .string()
    .min(10, "Explanation must be at least 10 characters")
    .trim(),
}).refine(
  (data) => data.options.includes(data.correct_answer),
  {
    message: "Correct answer must be one of the provided options",
    path: ["correct_answer"],
  }
);

// Type exports
export type GrammarCategoryFormData = z.infer<typeof grammarCategorySchema>;
export type CreateGrammarCategoryFormData = z.infer<typeof createGrammarCategorySchema>;
export type UpdateGrammarCategoryFormData = z.infer<typeof updateGrammarCategorySchema>;

export type GrammarTopicFormData = z.infer<typeof grammarTopicSchema>;
export type CreateGrammarTopicFormData = z.infer<typeof createGrammarTopicSchema>;
export type UpdateGrammarTopicFormData = z.infer<typeof updateGrammarTopicSchema>;

export type GrammarQuestionFormData = z.infer<typeof grammarQuestionSchema>;
