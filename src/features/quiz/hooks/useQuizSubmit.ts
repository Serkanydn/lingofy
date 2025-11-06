import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QuizAttempt } from "@/shared/types/content.types";
import { QuizAnswer } from "../types/quiz.types";
import { quizService } from "../services";
import { authService } from "@/features/auth/services";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface QuizSubmitParams {
  quiz_content_id: string;
  answers: QuizAnswer[];
  total_score: number;
  max_score: number;
  percentage: number;
}

export function useQuizSubmit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      quiz_content_id,
      answers,
      total_score,
      max_score,
      percentage,
    }: QuizSubmitParams) => {
      const { user } = useAuth();

      if (!user) throw new Error("Not authenticated");

      return await quizService.submitQuizAttempt(
        quiz_content_id,
        user.id,
        answers,
        total_score,
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
    },
    onError: (error) => {
      toast.error("Failed to submit quiz. Please try again.");
      console.error("Quiz submission error:", error);
    },
  });
}
