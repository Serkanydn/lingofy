import { useMutation, useQueryClient } from '@tanstack/react-query'
import { quizService } from '../services/quizService'
import { QuizAttempt } from '../types/quiz.types'
import { toast } from '@/shared/components/ui/use-toast'

export function useQuizSubmit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (attempt: Omit<QuizAttempt, 'id' | 'completed_at'>) =>
      quizService.submitQuizAttempt(attempt),
    onSuccess: (data) => {
      toast({
        title: 'Quiz Submitted!',
        description: `You scored ${data.percentage.toFixed(0)}%`,
      })
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['quiz-history'] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
      queryClient.invalidateQueries({ queryKey: ['quiz-attempted'] })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to submit quiz. Please try again.',
        variant: 'destructive',
      })
      console.error('Quiz submission error:', error)
    },
  })
}