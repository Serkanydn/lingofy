import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase/client";

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
      const { data, error } = await supabase
        .from("user_words")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as UserWord[];
    },
  });
}

export function useAddWord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (word: Omit<UserWord, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("user_words")
        .insert(word)
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { error } = await supabase
        .from("user_words")
        .delete()
        .eq("id", wordId);

      if (error) throw error;
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
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("user_statistics")
        .update({
          flashcard_practice_count: supabase.rpc("increment_flashcard_count"),
        })
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
    },
  });
}
