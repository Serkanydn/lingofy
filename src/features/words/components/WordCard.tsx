'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Volume2, Trash2 } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteWord, UserWord } from '../hooks/useWords'

interface WordCardProps {
  word: UserWord
}

export function WordCard({ word }: WordCardProps) {
  const [showDelete, setShowDelete] = useState(false)
  const deleteWord = useDeleteWord()

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(word.word)
    utterance.lang = 'en-US'
    utterance.rate = 0.8
    window.speechSynthesis.speak(utterance)
  }

  const handleDelete = async () => {
    await deleteWord.mutateAsync(word.id)
    setShowDelete(false)
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold">{word.word}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleSpeak}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-lg text-muted-foreground">{word.translation}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => setShowDelete(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
              <p className="text-sm font-medium text-blue-900 mb-1">English:</p>
              <p className="text-blue-800">{word.example_sentence_en}</p>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
              <p className="text-sm font-medium text-green-900 mb-1">Türkçe:</p>
              <p className="text-green-800">{word.example_sentence_tr}</p>
            </div>
          </div>

          {word.source_type && (
            <div className="mt-4 text-xs text-muted-foreground">
              Added from {word.source_type}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Word</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{word.word}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}