import { quizService } from "../services";
import { useQuery } from "@tanstack/react-query";

export function useQuiz(contentId: string) {
  return useQuery({
    queryKey: ["quiz", contentId],
    queryFn: () => quizService.getQuizByContent(contentId),
    enabled: !!contentId,
  });
}

export function useQuizHistory(userId: string) {
  return useQuery({
    queryKey: ["quiz-history", userId],
    queryFn: () => quizService.getUserQuizHistory(userId),
    enabled: !!userId,
  });
}

export function useHasAttempted(userId: string, quizContentId: string) {
  return useQuery({
    queryKey: ["quiz-attempted", userId, quizContentId],
    queryFn: () => quizService.hasAttempted(userId, quizContentId),
    enabled: !!userId && !!quizContentId,
  });
}

export function useQuizFromId(contentId: string) {
  console.log('contentId',contentId);
  return useQuery({
    queryKey: ["quiz", contentId],
    queryFn: () => quizService.getQuizByContentId(contentId),
    enabled: !!contentId,
  });
}
