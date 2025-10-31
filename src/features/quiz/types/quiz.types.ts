import { Level, ContentType } from '@/shared/types/common.types'

export type QuizQuestion = {
  id: string
  content_id: string
  content_type: ContentType
  question_text: string
  options: string[]
  correct_answer: number
  explanation: string | null
  order_index: number
}

export type QuizResult = {
  id: string
  user_id: string
  content_id: string
  content_type: ContentType
  score: number
  total_questions: number
  answers: QuizAnswer[]
  created_at: string
}

export type QuizAnswer = {
  question_id: string
  selected_option: number
  is_correct: boolean
  time_taken: number
}

export type QuizSubmission = {
  contentType: ContentType
  contentId: string
  score: number
  totalQuestions: number
  answers: QuizAnswer[]
}