import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Level } from "@/shared/types/common.types";
import type { ReadingContent } from "../types/reading.types";
import type {
  QuizQuestion,
  QuizResult,
  QuizSubmission,
} from "@/features/quiz/types/quiz.types";
import { readingService } from "../services";
import { quizService } from "@/features/quiz/services";
import { authService } from "@/features/auth/services";

/**
 * Hook to fetch reading content list by level
 */
export function useReadingByLevel(level: Level) {
  return useQuery({
    queryKey: ["reading", level],
    queryFn: async () => {
      return readingService.getTextsByLevel(level);
    },
  });
}

/**
 * Hook to fetch reading content details by id
 */
export function useReadingDetail(id: string) {
  return useQuery({
    queryKey: ["reading", id],
    queryFn: async () => {
      return readingService.getById(id);
    },
  });
}

/**
 * Hook to fetch quiz questions for reading content
 */
export function useReadingQuiz(contentId: string) {
  return useQuery({
    queryKey: ["quiz", "reading", contentId],
    queryFn: async () => {
      const { questions } = await readingService.getTextWithQuestions(
        Number(contentId)
      );
      return questions;
    },
  });
}

/**
 * Hook to submit quiz results
 */
export function useSubmitQuiz() {
  const queryClient = useQueryClient();

  return useMutation<QuizResult, Error, QuizSubmission>({
    mutationFn: async (submission: QuizSubmission) => {
      const user = await authService.getCurrentUser();
      if (!user) throw new Error("Not authenticated");

      const result = await quizService.submitQuizAttempt(
        submission.contentId,
        user.id,
        submission.answers
      );

      return {
        id: result.id.toString(),
        user_id: result.user_id,
        content_id: submission.contentId,
        content_type: submission.contentType,
        score: submission.score,
        total_questions: submission.totalQuestions,
        answers: submission.answers,
        created_at: result.completed_at,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
    },
  });
}