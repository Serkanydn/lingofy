/**
 * User service layer
 * Following: docs/03-code-standards/01-design-patterns.md (Service Layer Pattern)
 */

import { supabase } from '@/shared/lib/supabase/client';
import type { User, UpdateUserInput } from '../types/user.types';

class UserService {
  /**
   * Get all users
   */
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update user
   */
  async update(id: string, input: UpdateUserInput): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const userService = new UserService();