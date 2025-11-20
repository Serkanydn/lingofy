/**
 * User service layer
 * Following: docs/03-code-standards/01-design-patterns.md (Service Layer Pattern)
 */

import { BaseService } from "@/shared/services/supabase/baseService";
import { UpdateUserInput, UserProfile } from "@/shared/types/model/user.types";

class UserService extends BaseService {
  constructor() {
    super("profiles");
  }
  /**
   * Get all users
   */
  async getAll(): Promise<UserProfile[]> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []) as any;
  }

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<UserProfile> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as UserProfile;
  }

  /**
   * Update user
   */
  async update(id: string, input: UpdateUserInput): Promise<UserProfile> {
    const { data, error } = await this.supabase
      .from("profiles")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as UserProfile;
  }
}

export const userService = new UserService();
