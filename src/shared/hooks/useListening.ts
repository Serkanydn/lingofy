import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase/client'
import { Level } from '../types/common.types'

export interface ListeningContent {
  id: string
  title: string
  level: Level
  description: string
  audio_urls: string[]
  duration_seconds: number
  transcript: string
  is_premium: boolean
  order_index: number
}

export function useListeningByLevel(level: Level) {
  return useQuery({
    queryKey: ['listening', level],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listening_content')
        .select('*')
        .eq('level', level)
        .order('order_index')

      if (error) throw error
      return data as ListeningContent[]
    },
  })
}

export function useListeningDetail(id: string) {
  return useQuery({
    queryKey: ['listening', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listening_content')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as ListeningContent
    },
  })
}

export function useListeningQuiz(contentId: string) {
  return useQuery({
    queryKey: ['quiz', 'listening', contentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('content_type', 'listening')
        .eq('content_id', contentId)
        .order('order_index')

      if (error) throw error
      return data
    },
  })
}