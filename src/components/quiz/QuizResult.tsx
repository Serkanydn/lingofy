'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QuizQuestion } from '@/types/content.types'
import { CheckCircle2, XCircle, RotateCcw, ArrowLeft } from 'lucide-react'

interface QuizResultProps {
  score: number
  totalQuestions: number
  questions: QuizQuestion[]
  userAnswers: number[]
  onRetry: () => void
  onExit: () => void
}

export function QuizResult({
  score,
  totalQuestions,
  questions,
  userAnswers,
  onRetry,
  onExit,
}: QuizResultProps) {
  const percentage = Math.round((score / totalQuestions) * 100)
  
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreMessage = () => {
    if (percentage >= 80) return 'Excellent! 🎉'
    if (percentage >= 60) return 'Good Job! 👍'
    return 'Keep Practicing! 💪'
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="mb-6">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl mb-2">{getScoreMessage()}</CardTitle>
          <div className={`text-6xl font-bold ${getScoreColor()}`}>
            {percentage}%
          </div>
          <p className="text-muted-foreground mt-2">
            You got {score} out of {totalQuestions} questions correct
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button className="flex-1" onClick={onRetry}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" className="flex-1" onClick={onExit}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Content
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Review Your Answers</h3>
        {questions.map((question, index) => {
          const userAnswer = userAnswers[index]
          const isCorrect = userAnswer === question.correct_answer

          return (
            <Card key={question.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  {isCorrect ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium mb-2">
                      Question {index + 1}: {question.question_text}
                    </p>
                    
                    <div className="space-y-2 mb-3">
                      <div className={`p-3 rounded-lg ${
                        isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                      }`}>
                        <span className="text-sm font-medium">Your answer: </span>
                        <span>{question.options[userAnswer]}</span>
                      </div>
                      
                      {!isCorrect && (
                        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                          <span className="text-sm font-medium">Correct answer: </span>
                          <span>{question.options[question.correct_answer]}</span>
                        </div>
                      )}
                    </div>

                    {question.explanation && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm">
                          <span className="font-medium">Explanation: </span>
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}