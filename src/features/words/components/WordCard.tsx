'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Volume2, Trash2, Folder, Edit } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
import { useDeleteWord, UserWord, useWordCategories, useAssignWordToCategory } from '../hooks/useWords'
import { UpdateWordDialog } from './UpdateWordDialog'

interface WordCardProps {
  word: UserWord
}

export function WordCard({ word }: WordCardProps) {
  const [showDelete, setShowDelete] = useState(false)
  const [showUpdate, setShowUpdate] = useState(false)
  const deleteWord = useDeleteWord()
  const { data: categories } = useWordCategories()
  const assignToCategory = useAssignWordToCategory()

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

  const handleCategoryChange = (categoryId: string) => {
    assignToCategory.mutate({
      wordId: word.id,
      categoryId: categoryId === "none" ? null : categoryId,
    })
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
              {word.description && (
                <p className="text-sm text-muted-foreground mt-2 italic">{word.description}</p>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-blue-600 hover:text-blue-700"
                onClick={() => setShowUpdate(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => setShowDelete(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {word.example_sentences?.map((example, index) => (
              <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="text-sm font-medium text-blue-900 mb-1">Example {word.example_sentences.length > 1 ? index + 1 : ''}:</p>
                <p className="text-blue-800">{example}</p>
              </div>
            ))}
          </div>

          {word.source_type && (
            <div className="mt-4 text-xs text-muted-foreground">
              Added from {word.source_type}
            </div>
          )}

          <div className="mt-4 flex items-center gap-2">
            <Folder className="h-4 w-4 text-muted-foreground" />
            <Select
              value={(word as any).category_id || "none"}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="No category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No category</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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

      <UpdateWordDialog
        open={showUpdate}
        onClose={() => setShowUpdate(false)}
        word={word}
      />
    </>
  )
}