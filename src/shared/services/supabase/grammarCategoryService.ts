import { BaseService } from "@/shared/services/supabase/baseService";
import { GrammarCategory } from "@/shared/types/model/grammarCategory.types";

export class GrammarCategoryService extends BaseService<GrammarCategory> {
  constructor() {
    super("grammar_categories");
  }

  async getAllActive() {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("is_active", true)
      .order("order", { ascending: true });

    if (error) throw error;
    return data as GrammarCategory[];
  }

  async getBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data as GrammarCategory;
  }

  async createCategory(
    categoryData: Omit<GrammarCategory, "id" | "created_at" | "updated_at">
  ) {
    return this.create(categoryData);
  }

  async updateCategory(
    id: string,
    categoryData: Partial<
      Omit<GrammarCategory, "id" | "created_at" | "updated_at">
    >
  ) {
    return this.update(id, categoryData);
  }

  async toggleActive(id: string, isActive: boolean) {
    return this.update(id, { is_active: isActive });
  }

  async reorder(categories: Array<{ id: string; order: number }>) {
    const updates = categories.map(({ id, order }) =>
      this.update(id, { order })
    );
    return Promise.all(updates);
  }
}

export const grammarCategoryService = new GrammarCategoryService();
