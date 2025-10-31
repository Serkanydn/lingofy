'use client'

import { QuizQuestion, UserAnswer } from '../types/quiz.types'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils/cn'
import { CheckCircle2, XCircle } from 'lucide-react'
import { quizValidator } from '../utils/quizValidator'

interface TrueFalseQuestionProps {
  question: QuizQuestion
  userAnswer?: UserAnswer
  onAnswer: (answer: UserAnswer) => void
  isSubmitted: boolean
  showFeedback: boolean
}

export function TrueFalseQuestion({
  question,
  userAnswer,
  onAnswer,
  isSubmitted,
  showFeedback,
}: TrueFalseQuestionProps) {
  const handleOptionClick = (optionId: string) => {
    if (isSubmitted) return

    onAnswer({
      question_id: question.id,
      type: 'option',
      selectedOptionId: optionId,
      textAnswer: null,
    })
  }

  const isCorrect = showFeedback && quizValidator.isAnswerCorrect(question, userAnswer!)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-semibold leading-relaxed flex-1">
          {question.question_text}
        </h3>
        <div className="ml-4 text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
          {question.points} pts
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option) => {
          const isSelected = userAnswer?.selectedOptionId === option.id
          const isCorrectOption = option.is_correct
          const showAsCorrect = showFeedback && isSelected && isCorrect
          const showAsWrong = showFeedback && isSelected && !isCorrect
          const showAsCorrectAnswer = showFeedback && !isSelected && isCorrectOption

          return (
            <Button
              key={option.id}
              variant="outline"
              className={cn(
                'h-24 text-lg font-semibold transition-all',
                isSelected && !showFeedback && 'bg-primary/10 border-primary ring-2 ring-primary',
                showAsCorrect && 'bg-green-50 border-green-500 hover:bg-green-50 ring-2 ring-green-500',
                showAsWrong && 'bg-red-50 border-red-500 hover:bg-red-50 ring-2 ring-red-500',
                showAsCorrectAnswer && 'bg-green-50 border-green-200',
                isSubmitted && 'cursor-not-allowed'
              )}
              onClick={() => handleOptionClick(option.id)}
              disabled={isSubmitted}
            >
              <div className="flex flex-col items-center gap-2">
                <span>{option.text}</span>
                {showAsCorrect && <CheckCircle2 className="h-6 w-6 text-green-600" />}
                {showAsWrong && <XCircle className="h-6 w-6 text-red-600" />}
                {showAsCorrectAnswer && (
                  <span className="text-xs text-green-600 font-medium">Correct</span>
                )}
              </div>
            </Button>
          )
        })}
      </div>
    </div>
  )
}