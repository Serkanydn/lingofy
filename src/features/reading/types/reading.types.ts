import { Level } from '@/shared/types/common.types'

export type ReadingContent = {
  id: string
  title: string
  content: string
  level: Level
  audio_url: string
  is_premium: boolean
  order_index: number
  created_at: string
  category?: string
  image_url?: string
}

export type ReadingFilters = {
  level?: Level
  search?: string
  isPremium?: boolean
}

export type ReadingStats = {
  totalReadings: number
  completedReadings: number
  averageScore: number
  timeSpent: number
  level: Level
}