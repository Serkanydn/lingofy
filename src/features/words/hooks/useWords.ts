import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/features/auth/services";
import { wordsService } from "../services";
import { statisticsService } from "@/features/statistics/services";

export interface UserWord {
  id: string;
  word: string;
  translation: string;
  example_sentence_en: string;
  example_sentence_tr: string;
  audio_url?: string;
  source_type?: "reading" | "listening";
  source_id?: string;
  created_at: string;
}

export function useUserWords() {
  return useQuery({
    queryKey: ["user-words"],
    queryFn: async () => {
      return wordsService.getAll();
    },
  });
}

export function useAddWord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (word: Omit<UserWord, "id" | "created_at">) => {
      return wordsService.create(word);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-words"] });
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
    },
  });
}

export function useDeleteWord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (wordId: string) => {
      await wordsService.delete(wordId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-words"] });
    },
  });
}

export function useUpdateFlashcardPractice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const user = await authService.getCurrentUser();
      if (!user) throw new Error("Not authenticated");

      await statisticsService.incrementFlashcardCount(user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
    },
  });
}