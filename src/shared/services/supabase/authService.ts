import { BaseService } from "@/shared/services/supabase/baseService";
import { Session, User } from "@supabase/supabase-js";

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
    const { data, error } =
      await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) throw error;
    return data;
  }

  async signInWithOAuth(
    provider: "google" | "github" | "facebook",
    redirectTo: string
  ) {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
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

  async signUp(
    email: string,
    password: string,
    metadata?: Record<string, any>
  ) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: metadata
        ? {
            data: metadata,
          }
        : undefined,
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
      redirectTo: `${window.location.origin}/api/auth/callback?next=/reset-password`,
    });

    if (error) throw error;
  }

  async updatePassword(newPassword: string) {
    try {
      console.log("updatePassword: Calling API route...");

      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      });

      const responseData = await response.json();

      console.log("updatePassword: API response:", {
        status: response.status,
        ok: response.ok,
        data: responseData,
      });

      if (!response.ok) {
        return {
          data: null,
          error: new Error(responseData.error || "Failed to update password"),
        };
      }

      return {
        data: { user: responseData.user },
        error: null,
      };
    } catch (err: any) {
      console.error("updatePassword: Fetch error:", err);
      return {
        data: null,
        error: err instanceof Error ? err : new Error(String(err)),
      };
    }
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

  async onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    const { data: { subscription } } = this.supabase.auth.onAuthStateChange(callback);
    return subscription;
  }
  
}

export const authService = new AuthService();
