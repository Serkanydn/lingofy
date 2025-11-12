import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReadingContent } from "../types/reading.types";
import type {
  QuizQuestion,
  QuizResult,
  QuizSubmission,
} from "@/features/quiz/types/quiz.types";
import { readingService } from "../services";
import { quizService } from "@/features/quiz/services";
import { authService } from "@/features/auth/services";
import { Level } from "@/shared/types/common.types";

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
 * Hook to fetch user attempts for reading texts
 */
export function useReadingAttempts(contentIds: string[], userId?: string) {
  return useQuery({
    queryKey: ["reading", "attempts", contentIds, userId],
    queryFn: async () => {
      if (!userId || contentIds.length === 0) return [];
      return quizService.getUserAttemptsByContentIds(userId, contentIds);
    },
    enabled: !!userId && contentIds.length > 0,
  });
}

export function useReadingByLevelCount(level: Level) {
  return useQuery({
    queryKey: ["reading_level_count", level],
    queryFn: async () => {
      return readingService.getTextCountByLevel(level);
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
      return readingService.getReadingDetailById(id);
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
        contentId
      );
      return questions;
    },
  });
}

/**
 * Hook to fetch questions for reading content (for admin/editing)
 */
export function useReadingQuestions(contentId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["reading-questions", contentId],
    queryFn: async () => {
      if (!contentId) return [];
      console.log("Fetching questions for reading:", contentId);
      const questions = await readingService.getQuestionsForContent(contentId);
      console.log("Fetched questions:", questions);
      return questions;
    },
    enabled: !!contentId && enabled,
    staleTime: 0, // Always fetch fresh data
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
        submission.answers,
        submission.score,
        submission.maxScore,
        (submission.score / submission.maxScore) * 100
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
