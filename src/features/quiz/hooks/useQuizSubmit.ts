import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QuizAnswer } from "../../../shared/types/model/question.types";
 import { toast } from "sonner";
import { useAuth } from "@/shared/hooks/useAuth";
import { quizService } from "@/shared/services/supabase/quizService";

interface QuizSubmitParams {
  content_id: string;
  answers: QuizAnswer[];
  score: number;
  max_score: number;
  percentage: number;
}

export function useQuizSubmit() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({
      content_id,
      answers,
      score,
      max_score,
      percentage,
    }: QuizSubmitParams) => {
      if (!user) throw new Error("Not authenticated");

      return await quizService.submitQuizAttempt(
        content_id,
        user.id,
        answers,
        score,
        max_score,
        percentage
      );
    },
    onSuccess: (data) => {
      toast.success(`Quiz submitted successfully!`);
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["quiz-history"] });
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
      queryClient.invalidateQueries({ queryKey: ["quiz-attempted"] });
      queryClient.invalidateQueries({ queryKey: ["reading", "attempts"] });
    },
    onError: (error) => {
      toast.error("Failed to submit quiz. Please try again.");
      console.error("Quiz submission error:", error);
    },
  });
}
