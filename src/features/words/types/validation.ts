import { z } from "zod"

export const addWordSchema = z.object({
  word: z.string().min(1, "Word is required").max(100),
  description: z.string().min(1, "Description is required").max(500),
  example_sentences: z
    .array(z.string().trim().min(1, "Example cannot be empty"))
    .min(1, "At least one example is required")
    .max(10, "Maximum 10 examples allowed"),
  source_type: z.enum(["reading", "listening"]).optional(),
  source_id: z.string().uuid().optional(),
})

export const updateWordSchema = addWordSchema

export type AddWordInput = z.infer<typeof addWordSchema>
export type UpdateWordInput = z.infer<typeof updateWordSchema>

export const updateCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(40),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}){1,2}$/, "Invalid color format. Use hex like #3b82f6"),
})

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>