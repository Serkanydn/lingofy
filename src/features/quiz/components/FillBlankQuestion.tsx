"use client";

import { useState, useEffect } from "react";

import { CheckCircle2, XCircle } from "lucide-react";
import { quizValidator } from "../utils/quizValidator";
import { QuizQuestion, UserAnswer } from "../types/quiz.types";
import { Input } from "@/components/ui/input";
import { cn } from "@/shared/lib/utils";

interface FillBlankQuestionProps {
  question: QuizQuestion;
  userAnswer?: UserAnswer;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted: boolean;
  showFeedback: boolean;
}

export function FillBlankQuestion({
  question,
  userAnswer,
  onAnswer,
  isSubmitted,
  showFeedback,
}: FillBlankQuestionProps) {
  const [inputValue, setInputValue] = useState(userAnswer?.textAnswer || "");

  useEffect(() => {
    if (userAnswer?.textAnswer) {
      setInputValue(userAnswer.textAnswer);
    }
  }, [userAnswer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSubmitted) return;

    const value = e.target.value;
    setInputValue(value);

    onAnswer({
      question_id: question.id,
      type: "text",
      selectedOptionId: null,
      textAnswer: value,
    });
  };

  const isCorrect =
    showFeedback && quizValidator.isAnswerCorrect(question, userAnswer!);
  const correctAnswer = quizValidator.getCorrectAnswerText(question);

  // Split question text by underscores to show blanks
  const parts = question.text.split("_____");

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-relaxed mb-4">
          Question {question.order_index || 1}: Fill in the blank
        </h3>
        <div className="text-base leading-relaxed flex flex-wrap items-center gap-2">
          {parts.map((part, index) => (
            <span key={index} className="text-gray-800 dark:text-gray-300">
              {part}
              {index < parts.length - 1 && (
                <span className="inline-block mx-1">
                  <Input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    disabled={isSubmitted}
                    className={cn(
                      "inline-block w-48 mx-1 rounded-xl border-2 transition-all h-11",
                      !showFeedback && "border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:shadow-[0_4px_16px_rgba(251,146,60,0.3)]",
                      showFeedback &&
                        isCorrect &&
                        "border-green-500 bg-green-50 dark:bg-green-950/20 shadow-[0_4px_16px_rgba(34,197,94,0.3)]",
                      showFeedback && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20 shadow-[0_4px_16px_rgba(239,68,68,0.3)]"
                    )}
                    placeholder="Type your answer..."
                  />
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {showFeedback && (
        <div
          className={cn(
            "p-5 rounded-2xl border-2 transition-all",
            isCorrect
              ? "bg-green-50 dark:bg-green-950/20 border-green-500 shadow-[0_4px_16px_rgba(34,197,94,0.3)]"
              : "bg-red-50 dark:bg-red-950/20 border-red-500 shadow-[0_4px_16px_rgba(239,68,68,0.3)]"
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800 dark:text-green-600">Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-800 dark:text-red-600">Incorrect</span>
              </>
            )}
          </div>
          {!isCorrect && (
            <div className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">Your answer: </span>
              <span className="font-medium text-red-800 dark:text-red-600">
                {inputValue || "(empty)"}
              </span>
              <br />
              <span className="text-gray-600 dark:text-gray-400">Correct answer: </span>
              <span className="font-medium text-green-800 dark:text-green-600">
                {correctAnswer}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
