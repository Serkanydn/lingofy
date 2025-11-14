/**
 * User validation schemas
 * Following: docs/04-typescript/validation.md
 */

import { z } from 'zod';

export const updateUserSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  is_premium: z.boolean().optional(),
  premium_expires_at: z.string().datetime().nullable().optional(),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;