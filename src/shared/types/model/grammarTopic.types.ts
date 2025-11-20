import { GrammarCategory } from "./grammarCategory.types";
import { BaseEntity } from "./base.type";
import { CEFRLevel } from "../enums/cefrLevel.enum";

export interface GrammarTopic extends BaseEntity {
  title: string;
  explanation: string;
  examples: string[];
  // examples: Record<string, any>; // jsonb
  mini_text: string;
  order: number | null;
  is_premium: boolean;
  category?: GrammarCategory;
  category_id: string | null;
  level: CEFRLevel;
}
 