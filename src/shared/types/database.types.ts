export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      app_settings: {
        Row: {
          id: string;
          site_name: string;
          site_description: string;
          contact_email: string;
          support_email: string;
          max_free_quizzes_per_day: number;
          enable_new_registrations: boolean;
          maintenance_mode: boolean;
          maintenance_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          site_name?: string;
          site_description?: string;
          contact_email?: string;
          support_email?: string;
          max_free_quizzes_per_day?: number;
          enable_new_registrations?: boolean;
          maintenance_mode?: boolean;
          maintenance_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          site_name?: string;
          site_description?: string;
          contact_email?: string;
          support_email?: string;
          max_free_quizzes_per_day?: number;
          enable_new_registrations?: boolean;
          maintenance_mode?: boolean;
          maintenance_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Add other table types here as needed
    }
  }
}