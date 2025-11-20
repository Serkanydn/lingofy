import { getSupabaseBrowserClient } from "@/shared/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

export class BaseService<T = any> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  get supabase(): SupabaseClient {
    return getSupabaseBrowserClient();
  }

  get supabaseBrowserClient(): SupabaseClient {
    return getSupabaseBrowserClient();
  }

  async getAll(): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*");

    if (error) throw error;
    return data as T[];
  }

  async getById(id: string | number): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as T;
  }

  async getReadingDetailById(id: string | number): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as T;
  }

  async create(payload: Partial<T>): Promise<T> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data as T;
  }

  async update(id: string | number, payload: Partial<T>): Promise<T> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as T;
  }

  async delete(id: string | number): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  async query() {
    return this.supabase.from(this.tableName);
  }
}
