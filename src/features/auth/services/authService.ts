import { BaseService } from "@/shared/services/supabase/baseService";
import { User } from "@supabase/supabase-js";

interface AuthUser extends User {
  id: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export class AuthService extends BaseService<AuthUser> {
  constructor() {
    super("users"); // Assuming your users table name is "users"
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser();

    if (error) throw error;
    return user as AuthUser;
  }

  async signInWithEmail(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signUpWithEmail(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async resetPassword(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    if (error) throw error;
  }

  async updatePassword(newPassword: string) {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  }

  async getSession() {
    const {
      data: { session },
      error,
    } = await this.supabase.auth.getSession();

    if (error) throw error;
    return session;
  }

  async refreshSession() {
    const {
      data: { session },
      error,
    } = await this.supabase.auth.refreshSession();

    if (error) throw error;
    return session;
  }
}
