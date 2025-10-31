'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useReading } from '../hooks/useReading'
import { useQuiz } from '@/features/quiz/hooks/useQuiz'
import { useQuizSubmit } from '@/features/quiz/hooks/useQuizSubmit'
import { useAuthStore } from '@/features/auth/store/authStore'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { ArrowLeft, Plus, Play } from 'lucide-react'
import { AudioPlayer } from '../components/AudioPlayer'
import { QuizContainer } from '@/features/quiz/components/QuizContainer'
import { AddWordDialog } from '@/features/words/components/AddWordDialog'

export function ReadingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const contentId = params.id as string
  const level = params.level as string
  
  const { user } = useAuthStore()
  const { data: reading, isLoading } = useReading(contentId)
  const { data: quiz } = useQuiz('reading', contentId)
  const submitQuiz = useQuizSubmit()
  
  const [showQuiz, setShowQuiz] = useState(false)
  const [showAddWord, setShowAddWord] = useState(false)
  const [selectedText, setSelectedText] = useState('')

  const handleTextSelection = () => {
    const selection = window.getSelection()?.toString().trim()
    if (selection) {
      setSelectedText(selection)
      setShowAddWord(true)
    }
  }

  const handleQuizComplete = async (score: number, maxScore: number) => {
    if (!user || !quiz) return

    await submitQuiz.mutateAsync({
      user_id: user.id,
      quiz_content_id: quiz.id,
      answers: [], // Will be populated by QuizContainer
      total_score: score,
      max_score: maxScore,
      percentage: (score / maxScore) * 100,
    })
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!reading) {
    return <div className="container mx-auto px-4 py-8">Reading not found</div>
  }

  if (showQuiz && quiz) {
    return (
      <QuizContainer
        quiz={quiz}
        onExit={() => setShowQuiz(false)}
        onComplete={handleQuizComplete}
      />
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => router.push(`/reading/${level}`)}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to {level} Texts
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge>{reading.level}</Badge>
            <span className="text-sm text-muted-foreground">
              {reading.word_count} words
            </span>
          </div>
          <CardTitle className="text-3xl mt-2">{reading.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <AudioPlayer audioUrls={reading.audio_urls} />

          <div
            className="prose prose-lg max-w-none"
            onMouseUp={handleTextSelection}
          >
            {reading.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex gap-4">
            <Button
              className="flex-1"
              size="lg"
              onClick={() => setShowQuiz(true)}
              disabled={!quiz}
            >
              <Play className="mr-2 h-5 w-5" />
              Take Quiz
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedText('')
                setShowAddWord(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Word
            </Button>
          </div>
        </CardContent>
      </Card>

      <AddWordDialog
        open={showAddWord}
        onClose={() => setShowAddWord(false)}
        initialWord={selectedText}
        sourceType="reading"
        sourceId={contentId}
      />
    </div>
  )
}