import { useQuery } from "@tanstack/react-query";
import { GrammarCategory } from "@/shared/types/common.types";
import { grammarService } from "../services";

export interface GrammarTopic {
  id: string;
  category: GrammarCategory;
  title: string;
  explanation: string;
  examples: string[];
  mini_text: string;
  order_index: number;
}

export function useGrammarByCategory(category: GrammarCategory) {
  return useQuery({
    queryKey: ["grammar", category],
    queryFn: async () => {
      return grammarService.getRulesByCategory(category);
    },
  });
}

export function useGrammarDetail(id: string) {
  return useQuery({
    queryKey: ["grammar", id],
    queryFn: async () => {
      return grammarService.getById(id);
    },
  });
}

export function useGrammarQuiz(topicId: string) {
  return useQuery({
    queryKey: ["quiz", "grammar", topicId],
    queryFn: async () => {
      const { exercises } = await grammarService.getRuleWithExercises(
        Number(topicId)
      );
      return exercises;
    },
  });
}