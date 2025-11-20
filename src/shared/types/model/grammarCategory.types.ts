import { BaseEntity } from "./base.type";

export interface GrammarCategory extends BaseEntity {
  name: string;
  slug: string;
  icon: string;
  color: string;
  order: number;
  is_active: boolean;
  description: string | null | undefined;
}
