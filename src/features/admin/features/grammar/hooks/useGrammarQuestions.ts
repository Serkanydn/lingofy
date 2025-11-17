import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/shared/lib/supabase/client";
import { quizService } from "@/features/quiz/services";

export function useGrammarQuestions(topicId: string) {
  return useQuery({
    queryKey: ["admin-grammar-questions", topicId],
    queryFn: async () => {
      // Get topic details
      const { data: topic, error: topicError } = await supabase
        .from("grammar_topics")
        .select("id, title")
        .eq("id", topicId)
        .single();

      if (topicError) throw topicError;
      if (!topic) throw new Error("Topic not found");

      const typedTopic = topic as any;

      // Get questions using quiz service
      const questions = await quizService.getQuizByContentId(topicId);

      return {
        topic: typedTopic,
        questions: questions || [],
      };
    },
  });
}
