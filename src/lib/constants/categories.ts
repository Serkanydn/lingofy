export const GRAMMAR_CATEGORIES = {
  tenses: {
    id: 'tenses',
    name: 'Tenses',
    description: 'Master English verb tenses',
    icon: '⏰',
  },
  modal_verbs: {
    id: 'modal_verbs',
    name: 'Modal Verbs',
    description: 'Can, must, should, and more',
    icon: '🔧',
  },
  conditionals: {
    id: 'conditionals',
    name: 'Conditionals',
    description: 'If clauses and conditions',
    icon: '❓',
  },
  tricky_topics: {
    id: 'tricky_topics',
    name: 'Tricky Topics',
    description: 'Common mistakes and confusions',
    icon: '🎯',
  },
} as const

export type GrammarCategory = keyof typeof GRAMMAR_CATEGORIES