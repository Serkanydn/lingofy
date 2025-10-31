'use client'

import { scoreCalculator } from '@/lib/utils/scoreCalculator'
import { QuizContent, QuizState, UserAnswer } from '@/types/content.types'
import { useState } from 'react'
import { QuizResult } from './QuizResult'
import { Button } from '../ui/button'
import { ArrowLeft, Send } from 'lucide-react'
import { Card } from '../ui/card'

interface QuizContainerProps {
  quiz: QuizContent
  onExit: () => void
  onComplete: (score: number, maxScore: number) => void
}

export function QuizContainer({ quiz, onExit, onComplete }: QuizContainerProps) {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    userAnswers: {},
    isSubmitted: false,
    showResults: false,
  })

  const currentQuestion = quiz.questions[quizState.currentQuestionIndex]
  const totalQuestions = quiz.questions.length
  const progress = ((quizState.currentQuestionIndex + 1) / totalQuestions) * 100

  const handleAnswer = (answer: UserAnswer) => {
    setQuizState((prev) => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [currentQuestion.id]: answer,
      },
    }))
  }

  const handleNext = () => {
    if (quizState.currentQuestionIndex < totalQuestions - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }))
    }
  }

  const handlePrevious = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }))
    }
  }

  const handleSubmit = () => {
    const { totalScore, maxScore, percentage } = scoreCalculator.calculateScore(
      quiz.questions,
      quizState.userAnswers
    )

    setQuizState((prev) => ({
      ...prev,
      isSubmitted: true,
      showResults: true,
    }))

    onComplete(totalScore, maxScore)
  }

  const handleRetry = () => {
    setQuizState({
      currentQuestionIndex: 0,
      userAnswers: {},
      isSubmitted: false,
      showResults: false,
    })
  }

  const isQuestionAnswered = (questionId: string) => {
    const answer = quizState.userAnswers[questionId]
    if (!answer) return false
    return !!(answer.selectedOptionId || answer.textAnswer)
  }

  const answeredCount = quiz.questions.filter((q) =>
    isQuestionAnswered(q.id)
  ).length

  if (quizState.showResults) {
    return (
      <QuizResult
        quiz={quiz}
        userAnswers={quizState.userAnswers}
        onRetry={handleRetry}
        onExit={onExit}
      />
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={onExit} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Exit Quiz
      </Button>

      <Card className="p-6">
        <QuizProgress
          currentQuestion={quizState.currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          answeredCount={answeredCount}
          progress={progress}
        />

        <div className="mt-8">
          <QuestionRenderer
            question={currentQuestion}
            userAnswer={quizState.userAnswers[currentQuestion.id]}
            onAnswer={handleAnswer}
            isSubmitted={quizState.isSubmitted}
            showFeedback={quizState.isSubmitted}
          />
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={quizState.currentQuestionIndex === 0}
          >
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            {answeredCount} / {totalQuestions} answered
          </div>

          {quizState.currentQuestionIndex === totalQuestions - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={answeredCount !== totalQuestions}
              className="min-w-[120px]"
            >
              <Send className="mr-2 h-4 w-4" />
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isQuestionAnswered(currentQuestion.id)}
            >
              Next
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}