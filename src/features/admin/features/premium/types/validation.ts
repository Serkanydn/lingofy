/**
 * Validation schemas for Premium feature
 * Following: docs/04-typescript/form-validation.md
 */

import { z } from 'zod';

/**
 * Create subscription validation schema
 */
export const createSubscriptionSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  full_name: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Full name must be less than 100 characters'),
  is_premium: z.boolean(),
  premium_expires_at: z
    .string()
    .optional()
    .nullable()
    .refine(
      (date) => {
        if (!date) return true;
        return new Date(date) > new Date();
      },
      { message: 'Expiration date must be in the future' }
    ),
});

/**
 * Update subscription validation schema
 */
export const updateSubscriptionSchema = z.object({
  is_premium: z.boolean(),
  premium_expires_at: z
    .string()
    .optional()
    .nullable()
    .refine(
      (date) => {
        if (!date) return true;
        return new Date(date) > new Date();
      },
      { message: 'Expiration date must be in the future' }
    ),
});

// Infer TypeScript types from schemas
export type CreateSubscriptionFormData = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionFormData = z.infer<typeof updateSubscriptionSchema>;
