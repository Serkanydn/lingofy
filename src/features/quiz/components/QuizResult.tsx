"use client";

import { scoreCalculator } from "../utils/scoreCalculator";
import { quizValidator } from "../utils/quizValidator";
import {
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  GraduationCap,
} from "lucide-react";
import { QuizContent, UserAnswer } from "../types/quiz.types";
import { Button } from "@/components/ui/button";

interface QuizResultProps {
  quiz: QuizContent;
  userAnswers: Record<string, UserAnswer>;
  onRetry: () => void;
  onExit: () => void;
}

export function QuizResult({
  quiz,
  userAnswers,
  onRetry,
  onExit,
}: QuizResultProps) {
  const { totalScore, maxScore, percentage } = scoreCalculator.calculateScore(
    quiz.questions,
    userAnswers
  );

  const performance = scoreCalculator.getPerformanceLevel(percentage);

  const correctCount = quiz.questions.filter((q) =>
    quizValidator.isAnswerCorrect(q, userAnswers[q.id])
  ).length;

  // Calculate time taken (mock for now)
  const timeTaken = "8 min 30 sec";

  return (
    <div className="min-h-screen bg-white dark:bg-background py-8 ">
      <div className="container mx-auto ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Personalized Study Dashboard: {quiz.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
          {/* Left Column - Score and Stats */}
          <div className="space-y-6">
            {/* Score Circle Card */}
            <div className="clay-shadow rounded-3xl  p-8 bg-background-light">
              <div className="flex flex-col items-center">
                {/* Circular Progress */}
                <div className="relative w-48 h-48 mb-6">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#E5E7EB"
                      strokeWidth="16"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#F97316"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 88}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 88 * (1 - percentage / 100)
                      }`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-gray-900 dark:text-white">
                      {percentage.toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Score
                    </div>
                  </div>
                </div>

                {/* Performance Message */}
                <div className="text-center mb-6 ">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {performance.message}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your Score: {totalScore}/{maxScore}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Excellent work! You have a solid understanding of the
                    present tense. Keep practicing to master it completely.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              {/* Time Taken */}
              <div className=" rounded-2xl clay-shadow p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-3">
                    <Clock className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Time Taken
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {timeTaken}
                  </div>
                </div>
              </div>

              {/* Questions Answered */}
              <div className=" rounded-2xl clay-shadow p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-3">
                    <HelpCircle className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Questions Answered
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {correctCount} / {quiz.questions.length}
                  </div>
                </div>
              </div>

              {/* Topic Proficiency */}
              <div className=" rounded-2xl clay-shadow p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-3">
                    <GraduationCap className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Topic Proficiency
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {quiz.title.split(" ")[0]}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    (High)
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={onRetry}
                variant="orange"
                size="xl"
                className="flex-1"
              >
                Next Lesson
              </Button>
              <Button
                onClick={onExit}
                variant="orange-outline"
                size="xl"
                className="flex-1"
              >
                Review All Answers
              </Button>
              <Button
                onClick={onRetry}
                variant="orange-outline"
                size="xl"
                className="flex-1"
              >
                Retake Quiz
              </Button>
            </div>
          </div>

          {/* Right Column - Answer Breakdown */}
          <div className=" rounded-3xl clay-shadow  p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Answer Breakdown
            </h2>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {quiz.questions.map((question, index) => {
                const userAnswer = userAnswers[question.id];
                const isCorrect = quizValidator.isAnswerCorrect(
                  question,
                  userAnswer
                );
                const correctOption = question.options.find(
                  (opt) => opt.is_correct
                );
                const userOption = question.options.find(
                  (opt) => opt.id === userAnswer?.selectedOptionId
                );

                return (
                  <div
                    key={question.id}
                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      {/* Check/Cross Icon */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isCorrect
                            ? "bg-green-100 dark:bg-green-900/20"
                            : "bg-red-100 dark:bg-red-900/20"
                        }`}
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>

                      {/* Question Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          {question.text}
                        </p>
                        <div className="text-xs space-y-1">
                          <div className="flex items-start gap-1">
                            <span className="text-green-600 dark:text-green-400 font-medium shrink-0">
                              Correct Answer:
                            </span>
                            <span className="text-green-600 dark:text-green-400">
                              {correctOption?.text}
                            </span>
                          </div>
                          <div className="flex items-start gap-1">
                            <span className="text-gray-600 dark:text-gray-400 font-medium shrink-0">
                              Your Answer:
                            </span>
                            <span
                              className={
                                isCorrect
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }
                            >
                              {userOption?.text || "No answer"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
