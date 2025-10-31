import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'

export interface UserStatistics {
  user_id: string
  total_reading_completed: number
  total_listening_completed: number
  total_quizzes_completed: number
  total_quiz_score: number
  total_words_added: number
  flashcard_practice_count: number
  total_usage_days: number
  last_activity_date: string | null
  most_studied_level: string | null
}

export function useStatistics() {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('user_statistics')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      return data as UserStatistics
    },
  })
}

export function useQuizHistory() {
  return useQuery({
    queryKey: ['quiz-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_quiz_results')
        .select('*')
        .order('completed_at', { ascending: false })
        .limit(20)

      if (error) throw error
      return data
    },
  })
}