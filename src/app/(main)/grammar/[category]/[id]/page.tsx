'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { DifficultyLevel } from '@/shared/types/content.types'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { QuizContainer } from '@/features/quiz/components/QuizContainer'
import { useGrammarDetail, useGrammarQuiz } from '@/features/grammar/hooks/useGrammar'

export default function GrammarTopicPage({ 
  params 
}: { 
  params: { category: string; id: string } 
}) {
  const { data: topic, isLoading } = useGrammarDetail(params.id)
  const { data: quizQuestions } = useGrammarQuiz(params.id)
  const [showQuiz, setShowQuiz] = useState(false)

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!topic) {
    return <div className="container mx-auto px-4 py-8">Topic not found</div>
  }

  if (showQuiz && quizQuestions) {
    return (
      <QuizContainer
        quiz={{
          id: params.id,
          content_type: 'grammar',
          content_id: params.id,
          title: topic.title,
          difficulty_level: 'intermediate', // Default difficulty level for grammar
          questions: quizQuestions
        }}
        onExit={() => setShowQuiz(false)}
        onComplete={(score, maxScore) => {
          setShowQuiz(false)
        }}
      />
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href={`/grammar/${params.category}`}>
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Topics
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{topic.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Explanation */}
          <div>
            <h3 className="text-xl font-semibold mb-3">📚 Explanation</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-lg leading-relaxed">{topic.explanation}</p>
            </div>
          </div>

          <Separator />

          {/* Examples */}
          <div>
            <h3 className="text-xl font-semibold mb-3">💡 Examples</h3>
            <div className="space-y-3">
              {topic.examples.map((example, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 bg-muted/50 rounded-lg p-4"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-lg">{example}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Mini Text */}
          <div>
            <h3 className="text-xl font-semibold mb-3">📖 Practice Text</h3>
            <div className="bg-linear-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">
                {topic.mini_text}
              </p>
            </div>
          </div>

          <Separator />

          <Button 
            className="w-full"
            size="lg"
            onClick={() => setShowQuiz(true)}
          >
            Take Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}