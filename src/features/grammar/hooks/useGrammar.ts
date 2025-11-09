import { useQuery } from "@tanstack/react-query";
import { grammarService } from "../services";
import { quizService } from "@/features/quiz/services";

export function useGrammarByCategory(categoryId: string) {
  return useQuery({
    queryKey: ["grammar", categoryId],
    queryFn: async () => {
      return grammarService.getRulesByCategory(categoryId);
    },
    enabled: !!categoryId,
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

export function useGrammarQuiz(topicId?: string) {
  return useQuery({
    queryKey: ["quiz", "grammar", topicId],
    queryFn: async () => {
      const data = await quizService.getById(topicId!);
      console.log("data", data);

      return data;
    },
    enabled: topicId !== undefined,
  });
}

/**
 * Hook to fetch user attempts for grammar topics
 */
export function useGrammarAttempts(contentIds: string[], userId?: string) {
  return useQuery({
    queryKey: ["grammar", "attempts", contentIds, userId],
    queryFn: async () => {
      if (!userId || contentIds.length === 0) return [];
      return quizService.getUserAttemptsByContentIds(userId, contentIds);
    },
    enabled: !!userId && contentIds.length > 0,
  });
}
