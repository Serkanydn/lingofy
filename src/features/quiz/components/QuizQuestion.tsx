'use client'

import { Button } from '@/components/ui/button'
import type { QuizQuestion } from '../types/quiz.types'

interface QuizQuestionProps {
  question: QuizQuestion
  onAnswer: (answerIndex: number) => void
}

export function QuizQuestion({ question, onAnswer }: QuizQuestionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold leading-relaxed">
        {question.question_text}
      </h3>

      <div className="grid gap-3">
        {question.options.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto py-4 px-6 text-left justify-start hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => onAnswer(index)}
          >
            <span className="flex items-center gap-3 w-full">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-semibold">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1">{option.text}</span>
            </span>
          </Button>
        ))}
      </div>
    </div>
  )
}