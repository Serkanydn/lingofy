import { Level } from '@/shared/types/common.types'
import { GrammarCategory } from './category.types'

export type GrammarTopic = {
  id: string
  title: string
  category_id: string
  category?: GrammarCategory
  explanation: string
  examples: string[]
  mini_text: string
  level: Level
  is_premium: boolean
  order_index: number
  created_at: string
}

export type GrammarFilters = {
  category_id?: string
  search?: string
  isPremium?: boolean
}

export type GrammarStats = {
  totalLessons: number
  completedLessons: number
  averageScore: number
  timeSpent: number
  category_id: string
  category?: GrammarCategory
}