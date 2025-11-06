import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QuizAttempt } from '@/shared/types/content.types'
import { QuizAnswer } from '../types/quiz.types'
import { quizService } from '../services'
import { authService } from '@/features/auth/services'
import { toast } from 'sonner'

interface QuizSubmitParams {
  contentId: string;
  answers: QuizAnswer[];
}

export function useQuizSubmit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ contentId, answers }: QuizSubmitParams) => {
      const user = await authService.getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      const attempt = await quizService.submitQuizAttempt(
        contentId,
        user.id,
        answers
      );

      return attempt;
    },
    onSuccess: (data) => {
      toast.success(`Quiz submitted successfully!`)
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['quiz-history'] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
      queryClient.invalidateQueries({ queryKey: ['quiz-attempted'] })
    },
    onError: (error) => {
      toast.error('Failed to submit quiz. Please try again.')
      console.error('Quiz submission error:', error)
    },
  })
}