'use client'

import { useReadingDetail, useReadingQuiz } from '@/lib/hooks/useReading'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import AudioPlayer from '@/components/reading/AudioPlayer'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import QuizContainer from '@/components/quiz/QuizContainer'
import { useState } from 'react'

export default function ReadingDetailPage({
  params,
}: {
  params: { level: string; id: string }
}) {
  const { data: reading, isLoading: isLoadingReading } = useReadingDetail(params.id)
  const { data: questions, isLoading: isLoadingQuiz } = useReadingQuiz(params.id)
  const [showQuiz, setShowQuiz] = useState(false)

  if (isLoadingReading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href={`/reading/${params.level}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reading List
            </Button>
          </Link>
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid gap-8">
          <Skeleton className="h-32" /> {/* Audio player skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  if (!reading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Reading Not Found</h1>
          <Link href={`/reading/${params.level}`}>
            <Button>Back to Reading List</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href={`/reading/${params.level}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reading List
          </Button>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <Badge>{params.level}</Badge>
          <h1 className="text-3xl font-bold">{reading.title}</h1>
        </div>
      </div>

      {reading.audio_urls && reading.audio_urls.length > 0 && (
        <div className="mb-8">
          <AudioPlayer audioUrls={reading.audio_urls} />
        </div>
      )}

      <Card className="p-6 mb-8">
        <div className="prose prose-blue max-w-none dark:prose-invert">
          {reading.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </Card>

      {!showQuiz && questions && questions.length > 0 && (
        <div className="text-center">
          <Button size="lg" onClick={() => setShowQuiz(true)}>
            Start Quiz
          </Button>
        </div>
      )}

      {showQuiz && questions && (
        <QuizContainer
          questions={questions}
          contentId={params.id}
          contentType="reading"
          onComplete={() => setShowQuiz(false)}
        />
      )}
    </div>
  )
}