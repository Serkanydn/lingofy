"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { quizValidator } from "../utils/quizValidator";
import { QuizQuestion, UserAnswer } from "../types/quiz.types";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/components/ui/button";

interface MultipleChoiceQuestionProps {
  question: QuizQuestion;
  userAnswer?: UserAnswer;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted: boolean;
  showFeedback: boolean;
}

export function MultipleChoiceQuestion({
  question,
  userAnswer,
  onAnswer,
  isSubmitted,
  showFeedback,
}: MultipleChoiceQuestionProps) {
  console.log("question.options", question);
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

      <div className="grid gap-4">
        {question.options.map((option, index) => {
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
                "relative w-full text-left p-5 rounded-2xl  transition-all duration-300 flex items-center gap-4 clay-shadow",
                isSelected &&
                  !showFeedback &&
                  " bg-orange-50 dark:bg-orange-950/20  ",
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
              {/* Selection Radio/Icon */}
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                  isSelected &&
                    !showFeedback &&
                    "border-orange-500 bg-orange-500",
                  !isSelected &&
                    !showFeedback &&
                    "border-gray-300 dark:border-gray-600",
                  showAsCorrect && "border-green-500 bg-green-500",
                  showAsWrong && "border-red-500 bg-red-500"
                )}
              >
                {isSelected && !showFeedback && (
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                )}
                {showAsCorrect && (
                  <CheckCircle2 className="h-4 w-4 text-white" />
                )}
                {showAsWrong && <XCircle className="h-4 w-4 text-white" />}
              </div>

              {/* Option Text */}
              <span className="flex-1 text-base text-gray-800 dark:text-gray-300">
                {option.text}
              </span>

              {/* Correct Answer Label */}
              {showAsCorrectAnswer && (
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Correct
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
