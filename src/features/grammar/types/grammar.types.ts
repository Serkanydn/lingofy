import { Level, GrammarCategory } from '@/shared/types/common.types'

export type GrammarTopic = {
  id: string
  title: string
  category: GrammarCategory
  explanation: string
  examples: string[]
  mini_text: string
  difficulty_level: Level
  is_premium: boolean
  order_index: number
  created_at: string
}

export type GrammarFilters = {
  category?: GrammarCategory
  search?: string
  isPremium?: boolean
}

export type GrammarStats = {
  totalLessons: number
  completedLessons: number
  averageScore: number
  timeSpent: number
  category: GrammarCategory
}