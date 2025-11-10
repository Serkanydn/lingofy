"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { quizValidator } from "../utils/quizValidator";
import { QuizQuestion, UserAnswer } from "../types/quiz.types";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface TrueFalseQuestionProps {
  question: QuizQuestion;
  userAnswer?: UserAnswer;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted: boolean;
  showFeedback: boolean;
}

export function TrueFalseQuestion({
  question,
  userAnswer,
  onAnswer,
  isSubmitted,
  showFeedback,
}: TrueFalseQuestionProps) {
  const handleOptionClick = (optionId: string) => {
    if (isSubmitted) return;

    onAnswer({
      question_id: question.id,
      type: "option",
      selectedOptionId: optionId,
      textAnswer: null,
    });
  };

  const isCorrect =
    showFeedback && quizValidator.isAnswerCorrect(question, userAnswer!);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-relaxed">
          Question {question.order_index || 1}: {question.text}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option) => {
          const isSelected = userAnswer?.selectedOptionId === option.id;
          const isCorrectOption = option.is_correct;
          const showAsCorrect = showFeedback && isSelected && isCorrect;
          const showAsWrong = showFeedback && isSelected && !isCorrect;
          const showAsCorrectAnswer =
            showFeedback && !isSelected && isCorrectOption;

          return (
            <button
              key={option.id}
              className={cn(
                "h-24 text-base font-medium transition-all rounded-2xl  flex items-center justify-center clay-shadow w-full",
                isSelected &&
                  !showFeedback &&
                  " bg-orange-50 dark:bg-orange-950/20 ",
                !isSelected &&
                  !showFeedback &&
                  " dark:border-gray-700 bg-white dark:bg-card ",
                showAsCorrect && " bg-green-50 dark:bg-green-950/20 ",
                showAsWrong && " bg-red-50 dark:bg-red-950/20 ",
                showAsCorrectAnswer && " bg-green-50/50 dark:bg-green-950/10",
                isSubmitted && "cursor-not-allowed"
              )}
              onClick={() => handleOptionClick(option.id)}
              disabled={isSubmitted}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-gray-800 dark:text-gray-300 font-medium">
                  {option.text}
                </span>
                {showAsCorrect && (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                )}
                {showAsWrong && <XCircle className="h-5 w-5 text-red-600" />}
                {showAsCorrectAnswer && (
                  <span className="text-xs text-green-600 font-medium">
                    Correct
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
