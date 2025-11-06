import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Level } from '../types/common.types'
import { supabase } from '../lib/supabase/client'
import type { ReadingContent } from '@/features/reading/types/reading.types'
import type { QuizQuestion, QuizResult, QuizSubmission } from '@/features/quiz/types/quiz.types'

/**
 * Hook to fetch reading content list by level
 */
export function useReadingByLevel(level: Level) {
  console.log('level',level);
  return useQuery({
    queryKey: ['reading', level],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reading_content')
        .select('*')
        .eq('level', level)
        // .eq('type', 'reading')
        .order('order_index')

      if (error) throw error
      return data as ReadingContent[]
    },
  })
}

/**
 * Hook to fetch reading content details by id
 */
// export function useReadingDetail(id: string) {
//   return useQuery({
//     queryKey: ['reading', id],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('reading_content')
//         .select('*')
//         .eq('id', id)
//         .eq('"type"', 'reading')
//         .single()

//       if (error) throw error
//       return data as ReadingContent
//     },
//   })
// }

export function useReadingDetail(id: string) {
  return useQuery({
    queryKey: ['reading', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reading_content')
        .select('*')
        .eq('id', id)
        // If 'type' column exists and isn't reserved, keep it:
        // .eq('content_type', 'reading')
        .maybeSingle()

      if (error) throw error
      return data as ReadingContent
    },
  })
}


/**
 * Hook to fetch quiz questions for reading content
 */
export function useReadingQuiz(contentId: string) {
  return useQuery({
    queryKey: ['quiz', 'reading', contentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('content_type', 'reading')
        .eq('content_id', contentId)
        .order('order_index')

      if (error) throw error
      return data as QuizQuestion[]
    },
  })
}

/**
 * Hook to submit quiz results
 */
export function useSubmitQuiz() {
  const queryClient = useQueryClient()

  return useMutation<QuizResult, Error, QuizSubmission>({
    mutationFn: async ({ contentType, contentId, score, totalQuestions, answers }) => {
      const { data, error } = await supabase
        .from('user_quiz_results')
        .insert({
          content_type: contentType,
          content_id: contentId,
          score,
          total_questions: totalQuestions,
          answers,
        })
        .select()
        .single()

      if (error) throw error
      return data as QuizResult
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
    },
  })
}