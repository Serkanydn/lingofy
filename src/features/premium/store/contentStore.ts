import { create } from 'zustand'

interface ContentState {
  content: any[]
  setContent: (content: any[]) => void
}

export const useContentStore = create<ContentState>((set) => ({
  content: [],
  setContent: (content) => set({ content })
}))