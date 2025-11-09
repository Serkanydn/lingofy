import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/shared/lib/supabase/client";
import { toast } from "sonner";
import { quizService } from "@/features/quiz/services";

interface QuizQuestion {
  id: string;
  content_id: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  created_at: string;
}

interface GrammarTopic {
  id: string;
  title: string;
  category: string;
  content_id: string;
}

export function useGrammarQuestions(topicId: string) {
  return useQuery({
    queryKey: ["admin-grammar-questions", topicId],
    queryFn: async () => {
      // Get topic details
      const { data: topic, error: topicError } = await supabase
        .from("grammar_topics")
        .select("id, title, category, content_id")
        .eq("id", topicId)
        .single();

      if (topicError) throw topicError;
      if (!topic) throw new Error("Topic not found");

      const typedTopic = topic as GrammarTopic;

      // Get questions using quiz service
      const questions = await quizService.getQuizByContentId(topicId);

      return {
        topic: typedTopic,
        questions: questions || [],
      };
    },
  });
}
