/**
 * Settings domain types
 * Following: docs/03-code-standards/03-naming-conventions.md
 */

import { BaseEntity } from "@/shared/types/model/base.type";

export interface AppSettings extends BaseEntity {
  site_name: string;
  site_description: string;
  contact_email: string;
  support_email: string;
  max_free_quizzes_per_day: number;
  enable_new_registrations: boolean;
  maintenance_mode: boolean;
  maintenance_message: string | null;
}

export interface UpdateSettingsInput {
  site_name?: string;
  site_description?: string;
  contact_email?: string;
  support_email?: string;
  max_free_quizzes_per_day?: number;
  enable_new_registrations?: boolean;
  maintenance_mode?: boolean;
  maintenance_message?: string | null;
}
