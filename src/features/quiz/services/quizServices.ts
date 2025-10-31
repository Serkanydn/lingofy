import { supabase } from "@/shared/lib/supabase/client"
import { QuizAttempt, QuizContent } from "@/types/content.types"

export const quizService = {
  // Get quiz by content
  async getQuizByContent(
    contentType: 'reading' | 'listening' | 'grammar',
    contentId: string
  ): Promise<QuizContent | null> {
    // First get quiz_content
    const { data: quizContent, error: quizError } = await supabase
      .from('quiz_content')
      .select('*')
      .eq('content_type', contentType)
      .eq('content_id', contentId)
      .single()

    if (quizError || !quizContent) return null

    // Get questions with options
    const { data: questions, error: questionsError } = await supabase
      .from('quiz_questions')
      .select(`
        *,
        options:quiz_options(*)
      `)
      .eq('quiz_content_id', quizContent.id)
      .order('order_index')

    if (questionsError) throw questionsError

    return {
      ...quizContent,
      questions: questions || [],
    }
  },

  // Submit quiz attempt
  async submitQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'completed_at'>): Promise<QuizAttempt> {
    const { data, error } = await supabase
      .from('user_quiz_attempts')
      .insert({
        user_id: attempt.user_id,
        quiz_content_id: attempt.quiz_content_id,
        answers: attempt.answers,
        total_score: attempt.total_score,
        max_score: attempt.max_score,
        percentage: attempt.percentage,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get user's quiz history
  async getUserQuizHistory(userId: string, limit: number = 20) {
    const { data, error } = await supabase
      .from('user_quiz_attempts')
      .select(`
        *,
        quiz_content:quiz_content(*)
      `)
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  },

  // Check if user has attempted quiz
  async hasAttempted(userId: string, quizContentId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_quiz_attempts')
      .select('id')
      .eq('user_id', userId)
      .eq('quiz_content_id', quizContentId)
      .limit(1)

    if (error) return false
    return data && data.length > 0
  },
}