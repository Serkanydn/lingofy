import { BaseService } from "@/shared/services/supabase/baseService";
import { WordCategory } from "../hooks/useWords";

export class CategoryService extends BaseService<WordCategory> {
  constructor() {
    super("user_word_categories");
  }

  async getCategories(userId: string): Promise<WordCategory[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return (data || []) as WordCategory[];
  }

  async createCategory(
    userId: string,
    name: string,
    color: string,
    icon?: string
  ): Promise<WordCategory> {
    // Get the highest order_index for this user
    const { data: categories } = await this.supabase
      .from(this.tableName)
      .select("order_index")
      .eq("user_id", userId)
      .order("order_index", { ascending: false })
      .limit(1);

    const nextOrderIndex = categories && categories.length > 0 
      ? ((categories[0] as any).order_index || 0) + 1 
      : 0;

    return this.create({
      user_id: userId,
      name,
      color,
      icon,
      order_index: nextOrderIndex,
    } as any);
  }

  async updateCategory(
    id: string,
    userId: string,
    updates: Partial<Pick<WordCategory, "name" | "color" | "icon">>
  ): Promise<WordCategory> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(updates as any)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as WordCategory;
  }

  async deleteCategory(id: string, userId: string): Promise<void> {
    // First, remove category_id from all words in this category
    await this.supabase
      .from("user_words")
      .update({ category_id: null } as any)
      .eq("category_id", id)
      .eq("user_id", userId);

    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
  }

  async deleteCategoryCascade(id: string, userId: string): Promise<void> {
    const { error: wordsError } = await this.supabase
      .from("user_words")
      .delete()
      .eq("category_id", id)
      .eq("user_id", userId);

    if (wordsError) throw wordsError;

    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
  }

  async reorderCategories(userId: string, categoryIds: string[]): Promise<void> {
    const updates = categoryIds.map((id, index) => ({
      id,
      order_index: index,
    }));

    for (const update of updates) {
      await this.supabase
        .from(this.tableName)
        .update({ order_index: update.order_index } as any)
        .eq("id", update.id)
        .eq("user_id", userId);
    }
  }

  async assignWordToCategory(
    userId: string,
    wordId: string,
    categoryId: string | null
  ): Promise<void> {
    const { error } = await this.supabase
      .from("user_words")
      .update({ category_id: categoryId } as any)
      .eq("id", wordId)
      .eq("user_id", userId);

    if (error) throw error;
  }
}

export const categoryService = new CategoryService();
