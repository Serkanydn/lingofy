import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QuizAttempt } from '../types/content.types'
import { quizService } from '@/features/quiz/services/quizServices'
import { toast } from 'sonner'


export function useQuizSubmit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (attempt: Omit<QuizAttempt, 'id' | 'completed_at'>) =>
      quizService.submitQuizAttempt(attempt),
    onSuccess: (data) => {

      toast.success(`Quiz submitted successfully! == You scored ${data.percentage.toFixed(0)}%`)
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