export interface GrammarCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  color: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateGrammarCategoryData = Omit<GrammarCategory, 'id' | 'created_at' | 'updated_at'>;
export type UpdateGrammarCategoryData = Partial<CreateGrammarCategoryData>;
