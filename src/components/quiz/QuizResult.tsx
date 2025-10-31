'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Progress } from '@/shared/components/ui/progress'
import { QuizContent, UserAnswer } from '../types/quiz.types'
import { scoreCalculator } from '../utils/scoreCalculator'
import { quizValidator } from '../utils/quizValidator'
import { RotateCcw, ArrowLeft, CheckCircle2, XCircle, Trophy } from 'lucide-react'
import { QuestionRenderer } from './QuestionRenderer'

interface QuizResultProps {
  quiz: QuizContent
  userAnswers: Record<string, UserAnswer>
  onRetry: () => void
  onExit: () => void
}

export function QuizResult({ quiz, userAnswers, onRetry, onExit }: QuizResultProps) {
  const { totalScore, maxScore, percentage } = scoreCalculator.calculateScore(
    quiz.questions,
    userAnswers
  )

  const performance = scoreCalculator.getPerformanceLevel(percentage)
  
  const correctCount = quiz.questions.filter((q) =>
    quizValidator.isAnswerCorrect(q, userAnswers[q.id])
  ).length

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      {/* Score Summary Card */}
      <Card className="text-center border-2">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full">
              <Trophy className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl mb-2">{performance.message}</CardTitle>
          <div className={`text-6xl font-bold mb-2 ${performance.color}`}>
            {percentage.toFixed(0)}%
          </div>
          <p className="text-muted-foreground text-lg">
            You scored {totalScore} out of {maxScore} points
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center py-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Correct</p>
              <p className="text-2xl font-bold text-green-600">{correctCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Wrong</p>
              <p className="text-2xl font-bold text-red-600">
                {quiz.questions.length - correctCount}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-2xl font-bold">{quiz.questions.length}</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={onExit} className="flex-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Exit
            </Button>
            <Button onClick={onRetry} className="flex-1">
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Review */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold">Review Your Answers</h3>
        
        {quiz.questions.map((question, index) => {
          const userAnswer = userAnswers[question.id]
          const isCorrect = quizValidator.isAnswerCorrect(question, userAnswer)

          return (
            <Card key={question.id} className={isCorrect ? 'border-green-200' : 'border-red-200'}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0">
                    {isCorrect ? (
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                    ) : (
                      <div className="bg-red-100 p-2 rounded-full">
                        <XCircle className="h-6 w-6 text-red-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">Question {index + 1}</Badge>
                      <Badge variant={isCorrect ? 'default' : 'destructive'}>
                        {isCorrect ? `+${question.points} pts` : '0 pts'}
                      </Badge>
                    </div>
                    
                    <QuestionRenderer
                      question={question}
                      userAnswer={userAnswer}
                      onAnswer={() => {}}
                      isSubmitted={true}
                      showFeedback={true}
                    />
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