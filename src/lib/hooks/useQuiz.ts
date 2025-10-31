import { useQuery } from '@tanstack/react-query'
import { quizService } from '../services/quizService'

export function useQuiz(
  contentType: 'reading' | 'listening' | 'grammar',
  contentId: string
) {
  return useQuery({
    queryKey: ['quiz', contentType, contentId],
    queryFn: () => quizService.getQuizByContent(contentType, contentId),
    enabled: !!contentId,
  })
}

export function useQuizHistory(userId: string) {
  return useQuery({
    queryKey: ['quiz-history', userId],
    queryFn: () => quizService.getUserQuizHistory(userId),
    enabled: !!userId,
  })
}

export function useHasAttempted(userId: string, quizContentId: string) {
  return useQuery({
    queryKey: ['quiz-attempted', userId, quizContentId],
    queryFn: () => quizService.hasAttempted(userId, quizContentId),
    enabled: !!userId && !!quizContentId,
  })
}