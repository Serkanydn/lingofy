export type ContentType = 'reading' | 'listening' | 'grammar'

export type QuestionType = "multiple_choice" | "fill_blank" | "true_false";

export interface QuizOption {
  id: string
  text: string
  is_correct: boolean
}

export type QuizQuestion = {
  id: string
  content_id: string
  content_type: ContentType
  question_text: string
  options: QuizOption[]
  correct_answer: number
  explanation: string | null
  order_index: number
  points?: number
  type: QuestionType
}

export type QuizContent = {
  id: string
  title: string
  questions: QuizQuestion[]
}

export type UserAnswer = {
  question_id: string
  type: "option" | "text"
  selectedOptionId?: string | null
  textAnswer?: string | null
}

export type QuizState = {
  currentQuestionIndex: number
  userAnswers: Record<string, UserAnswer>
  isSubmitted: boolean
  showResults: boolean
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
  is_correct?: boolean
  time_taken: number
}

export type QuizSubmission = {
  contentType: ContentType
  contentId: string
  score: number
  maxScore: number
  totalQuestions: number
  answers: QuizAnswer[]
}