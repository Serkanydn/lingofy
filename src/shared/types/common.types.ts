export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'

export type ContentType = 'reading' | 'listening' | 'grammar'

export type GrammarCategory = 
  | 'tenses' 
  | 'modals' 
  | 'conditionals'
  | 'passive-voice'
  | 'reported-speech'
  | 'articles'
  | 'prepositions'
  | 'phrasal-verbs'

export type ApiResponse<T = any> = {
  data?: T
  error?: string
}

export type PaginatedResponse<T> = {
  data: T[]
  metadata: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

export type SelectOption = {
  label: string
  value: string
}

export type TableColumn<T> = {
  header: string
  accessorKey: keyof T
  cell?: (row: T) => React.ReactNode
}