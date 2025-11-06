'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useAddWord } from '@/shared/hooks/useWords'
import { Textarea } from '@/components/ui/textarea'


interface AddWordDialogProps {
  open: boolean
  onClose: () => void
  initialWord?: string
  sourceType?: 'reading' | 'listening'
  sourceId?: string
}

export function AddWordDialog({ 
  open, 
  onClose, 
  initialWord = '',
  sourceType,
  sourceId 
}: AddWordDialogProps) {
  const [word, setWord] = useState(initialWord)
  const [translation, setTranslation] = useState('')
  const [exampleEn, setExampleEn] = useState('')
  const [exampleTr, setExampleTr] = useState('')
  const addWord = useAddWord()

  useEffect(() => {
    if (open) {
      setWord(initialWord)
    }
  }, [open, initialWord])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!word || !translation || !exampleEn || !exampleTr) {
      toast.error('Please fill in all fields')
        return
    }

    try {
      await addWord.mutateAsync({
        word,
        translation,
        example_sentence_en: exampleEn,
        example_sentence_tr: exampleTr,
        source_type: sourceType,
        source_id: sourceId,
      })

      toast.success('Word added to your collection!')

      // Reset form
      setWord('')
      setTranslation('')
      setExampleEn('')
      setExampleTr('')
      onClose()
    } catch (error) {
      toast.error('Failed to add word')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Word</DialogTitle>
          <DialogDescription>
            Add a new word to your personal vocabulary collection
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="word">English Word *</Label>
            <Input
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="e.g., excellent"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="translation">Turkish Translation *</Label>
            <Input
              id="translation"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="e.g., mükemmel"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exampleEn">Example Sentence (English) *</Label>
            <Textarea
              id="exampleEn"
              value={exampleEn}
              onChange={(e) => setExampleEn(e.target.value)}
              placeholder="e.g., She did an excellent job on the project."
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exampleTr">Example Sentence (Turkish) *</Label>
            <Textarea
              id="exampleTr"
              value={exampleTr}
              onChange={(e) => setExampleTr(e.target.value)}
              placeholder="e.g., Projede mükemmel bir iş çıkardı."
              rows={2}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={addWord.isPending}>
              {addWord.isPending ? 'Adding...' : 'Add Word'}
            </Button>          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}