/**
 * Settings service layer
 * Following: docs/03-code-standards/01-design-patterns.md (Service Layer Pattern)
 */

import { supabase } from '@/shared/lib/supabase/client';
import type { Database } from '@/shared/types/database.types';
import type { AppSettings, UpdateSettingsInput } from '../types/settings.types';

type AppSettingsInsert = Database['public']['Tables']['app_settings']['Insert'];
type AppSettingsUpdate = Database['public']['Tables']['app_settings']['Update'];

class SettingsService {
  /**
   * Get application settings
   * Returns the first (and should be only) settings record
   */
  async get(): Promise<AppSettings | null> {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .single();

    if (error) {
      // If no settings exist, return null
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    
    return data;
  }

  /**
   * Update application settings
   */
  async update(input: UpdateSettingsInput): Promise<AppSettings> {
    // First, check if settings exist
    const existing = await this.get();

    if (!existing) {
      // Create initial settings if they don't exist
      const insertData: AppSettingsInsert = {
        site_name: input.site_name || 'Learn Quiz English',
        site_description: input.site_description || 'Master English through interactive quizzes',
        contact_email: input.contact_email || 'contact@learnquiz.com',
        support_email: input.support_email || 'support@learnquiz.com',
        max_free_quizzes_per_day: input.max_free_quizzes_per_day ?? 5,
        enable_new_registrations: input.enable_new_registrations ?? true,
        maintenance_mode: input.maintenance_mode ?? false,
        maintenance_message: input.maintenance_message || null,
      };

      const { data, error } = await supabase
        .from('app_settings')
        // @ts-expect-error - Table type will be available after running the migration
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    // Update existing settings
    const updateData: AppSettingsUpdate = {
      ...input,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('app_settings')
      // @ts-expect-error - Table type will be available after running the migration
      .update(updateData)
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const settingsService = new SettingsService();
