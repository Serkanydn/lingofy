/**
 * Settings validation schemas
 * Following: docs/04-typescript/validation.md
 */

import { z } from 'zod';

export const updateSettingsSchema = z.object({
  site_name: z.string().min(3, 'Site name must be at least 3 characters').max(100).optional(),
  site_description: z.string().min(10, 'Description must be at least 10 characters').max(500).optional(),
  contact_email: z.string().email('Invalid email address').optional(),
  support_email: z.string().email('Invalid email address').optional(),
  max_free_quizzes_per_day: z.number().min(0).max(100).optional(),
  enable_new_registrations: z.boolean().optional(),
  maintenance_mode: z.boolean().optional(),
  maintenance_message: z.string().max(500).nullable().optional(),
});

export type UpdateSettingsFormData = z.infer<typeof updateSettingsSchema>;
