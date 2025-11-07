'use client'


import { CheckCircle2, XCircle } from 'lucide-react'
import { quizValidator } from '../utils/quizValidator'
import { QuizQuestion, UserAnswer } from '../types/quiz.types'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/components/ui/button'

interface MultipleChoiceQuestionProps {
  question: QuizQuestion
  userAnswer?: UserAnswer
  onAnswer: (answer: UserAnswer) => void
  isSubmitted: boolean
  showFeedback: boolean
}

export function MultipleChoiceQuestion({
  question,
  userAnswer,
  onAnswer,
  isSubmitted,
  showFeedback,
}: MultipleChoiceQuestionProps) {

  console.log('question.options',question);
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

      <div className="grid gap-3">
        {question.options.map((option, index) => {
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
                'h-auto py-4 px-6 text-left justify-start transition-all',
                isSelected && !showFeedback && 'bg-primary/10 border-primary',
                showAsCorrect && 'bg-green-50 border-green-500 hover:bg-green-50',
                showAsWrong && 'bg-red-50 border-red-500 hover:bg-red-50',
                showAsCorrectAnswer && 'bg-green-50 border-green-200',
                isSubmitted && 'cursor-not-allowed'
              )}
              onClick={() => handleOptionClick(option.id)}
              disabled={isSubmitted}
            >
              <span className="flex items-center gap-3 w-full">
                <span
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold flex-shrink-0',
                    isSelected && !showFeedback && 'bg-primary text-primary-foreground',
                    showAsCorrect && 'bg-green-500 text-white',
                    showAsWrong && 'bg-red-500 text-white',
                    !isSelected && !showFeedback && 'bg-muted'
                  )}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option.text}</span>
                {showAsCorrect && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                {showAsWrong && <XCircle className="h-5 w-5 text-red-600" />}
                {showAsCorrectAnswer && (
                  <div className="text-xs text-green-600 font-medium">Correct Answer</div>
                )}
              </span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}