"use client";

import { useState, useEffect } from "react";

import { CheckCircle2, XCircle } from "lucide-react";
import { quizValidator } from "../utils/quizValidator";
import { QuizQuestion } from "../types/quiz.types";
import { UserAnswer } from "@/shared/types/content.types";
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
  const parts = question.question_text.split("_____");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold leading-relaxed mb-4">
            Fill in the blank
          </h3>
          <div className="text-lg leading-relaxed flex flex-wrap items-center gap-2">
            {parts.map((part, index) => (
              <span key={index}>
                {part}
                {index < parts.length - 1 && (
                  <span className="inline-block mx-1">
                    <Input
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      disabled={isSubmitted}
                      className={cn(
                        "inline-block w-48 mx-1",
                        showFeedback &&
                          isCorrect &&
                          "border-green-500 bg-green-50",
                        showFeedback && !isCorrect && "border-red-500 bg-red-50"
                      )}
                      placeholder="Type your answer..."
                    />
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
        <div className="ml-4 text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
          {question.points} pts
        </div>
      </div>

      {showFeedback && (
        <div
          className={cn(
            "p-4 rounded-lg border-l-4",
            isCorrect
              ? "bg-green-50 border-green-500"
              : "bg-red-50 border-red-500"
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-800">Incorrect</span>
              </>
            )}
          </div>
          {!isCorrect && (
            <div className="text-sm">
              <span className="text-muted-foreground">Your answer: </span>
              <span className="font-medium text-red-800">
                {inputValue || "(empty)"}
              </span>
              <br />
              <span className="text-muted-foreground">Correct answer: </span>
              <span className="font-medium text-green-800">
                {correctAnswer}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
