export function useGrammar() {
  // Grammar hook implementation
  return {}
}import { useQuery } from '@tanstack/react-query'
import { GrammarCategory } from '../types/common.types'
import { supabase } from '../lib/supabase/client'

export interface GrammarTopic {
  id: string
  category: GrammarCategory
  title: string
  explanation: string
  examples: string[]
  mini_text: string
  order_index: number
}

export function useGrammarByCategory(category: GrammarCategory) {
  return useQuery({
    queryKey: ['grammar', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grammar_topics')
        .select('*')
        .eq('category', category)
        .order('order_index')

      if (error) throw error
      return data as GrammarTopic[]
    },
  })
}

export function useGrammarDetail(id: string) {
  return useQuery({
    queryKey: ['grammar', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grammar_topics')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as GrammarTopic
    },
  })
}

export function useGrammarQuiz(topicId: string) {
  return useQuery({
    queryKey: ['quiz', 'grammar', topicId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('content_type', 'grammar')
        .eq('content_id', topicId)
        .order('order_index')

      if (error) throw error
      return data
    },
  })
}