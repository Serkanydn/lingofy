export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'

export interface BaseContent {
  id: string
  title: string
  description: string
  level: Level
  type: 'reading' | 'listening' | 'grammar'
  is_premium: boolean
  order_index: number
  created_at: string
}

export interface ReadingContent extends BaseContent {
  type: 'reading'
  content: string
  audio_urls: string[]
}

export interface QuizQuestion {
  id: string
  question_text: string
  options: string[]
  correct_answer: number
  explanation?: string
  content_type: 'reading' | 'listening' | 'grammar'
  content_id: string
  order_index: number
}

export interface QuizSubmission {
  contentType: 'reading' | 'listening' | 'grammar'
  contentId: string
  score: number
  totalQuestions: number
  answers: Record<string, any>
}

export interface QuizResult {
  id: string
  user_id: string
  content_type: 'reading' | 'listening' | 'grammar'
  content_id: string
  score: number
  total_questions: number
  answers: Record<string, any>
  created_at: string
}