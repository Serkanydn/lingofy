import { BaseService } from "@/shared/services/supabase/baseService";
import { Level, GrammarCategory } from "@/shared/types/common.types";

interface StatisticsData {
  id: string;
  user_id: string;
  total_attempts: number;
  successful_attempts: number;
  time_spent: number;
  level?: Level;
  category?: GrammarCategory;
  created_at: string;
  updated_at: string;
}

export class StatisticsService extends BaseService<StatisticsData> {
  constructor() {
    super("user_statistics");
  }

  async getUserStatistics(userId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return data;
  }

  async getStatisticsByType(userId: string, contentType: 'grammar' | 'reading' | 'listening') {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .eq("content_type", contentType);

    if (error) throw error;
    return data;
  }

  async getStatisticsByLevel(userId: string, level: Level) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .eq("level", level);

    if (error) throw error;
    return data;
  }

  async getStatisticsByCategory(userId: string, category: GrammarCategory) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .eq("category", category);

    if (error) throw error;
    return data;
  }

  async updateStatistics(userId: string, data: Partial<Omit<StatisticsData, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) {
    const { error } = await this.supabase
      .from(this.tableName)
      .upsert({
        user_id: userId,
        ...data,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  }
}