import { create } from 'zustand'

interface WordsState {
  words: any[]
  setWords: (words: any[]) => void
}

export const useWordsStore = create<WordsState>((set) => ({
  words: [],
  setWords: (words) => set({ words })
}))