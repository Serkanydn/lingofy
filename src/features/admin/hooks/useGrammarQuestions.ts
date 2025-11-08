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
  quiz_content_id: string;
}

export function useGrammarQuestions(topicId: string) {
  return useQuery({
    queryKey: ["admin-grammar-questions", topicId],
    queryFn: async () => {
      // Get topic details
      const { data: topic, error: topicError } = await supabase
        .from("grammar_topics")
        .select("id, title, category, quiz_content_id")
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

export function useCreateGrammarQuestion(topicId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      question: string;
      options: string[];
      correct_answer: string;
      explanation: string;
      content_id: string;
    }) => {
      const { data: question, error } = await supabase
        .from("quiz_content")
        .insert([data] as any)
        .select()
        .single();

      if (error) throw error;
      return question;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-grammar-questions", topicId],
      });
      toast.success("Question created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create question");
    },
  });
}

export function useUpdateGrammarQuestion(topicId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<QuizQuestion>;
    }) => {
      const result = await (supabase.from("quiz_content") as any)
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (result.error) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-grammar-questions", topicId],
      });
      toast.success("Question updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update question");
    },
  });
}

export function useDeleteGrammarQuestion(topicId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("quiz_content")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-grammar-questions", topicId],
      });
      toast.success("Question deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete question");
    },
  });
}
