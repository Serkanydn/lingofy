/**
 * Settings Zustand Store
 * Following: docs/03-code-standards/01-design-patterns.md (Zustand Store Pattern)
 */

import { create } from 'zustand';
import { settingsService } from '../services/settingsService';
import type { AppSettings } from '../types/settings.types';

interface SettingsState {
  settings: AppSettings | null;
  isLoading: boolean;
  error: Error | null;

  // Actions
  setSettings: (settings: AppSettings | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  
  // Async operations
  fetchSettings: () => Promise<void>;
  initialize: () => Promise<void>;

  // Getters
  getSiteName: () => string;
  getSiteDescription: () => string;
  getContactEmail: () => string;
  getSupportEmail: () => string;
  getMaxFreeQuizzes: () => number;
  getIsRegistrationEnabled: () => boolean;
  getIsMaintenanceMode: () => boolean;
  getMaintenanceMessage: () => string | null;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  isLoading: true,
  error: null,

  setSettings: (settings) => set({ settings }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchSettings: async () => {
    try {
      set({ isLoading: true, error: null });
      const settings = await settingsService.get();
      set({ settings, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      set({ error: error as Error, isLoading: false });
    }
  },

  initialize: async () => {
    try {
      set({ isLoading: true });
      const settings = await settingsService.get();
      set({ settings, isLoading: false });
    } catch (error) {
      console.error('Settings initialization failed:', error);
      set({ error: error as Error, isLoading: false });
    }
  },

  // Getters with defaults
  getSiteName: () => get().settings?.site_name || 'Learn Quiz English',
  getSiteDescription: () => get().settings?.site_description || 'Master English through interactive quizzes',
  getContactEmail: () => get().settings?.contact_email || 'contact@learnquiz.com',
  getSupportEmail: () => get().settings?.support_email || 'support@learnquiz.com',
  getMaxFreeQuizzes: () => get().settings?.max_free_quizzes_per_day ?? 5,
  getIsRegistrationEnabled: () => get().settings?.enable_new_registrations ?? true,
  getIsMaintenanceMode: () => get().settings?.maintenance_mode ?? false,
  getMaintenanceMessage: () => get().settings?.maintenance_message || null,
}));

