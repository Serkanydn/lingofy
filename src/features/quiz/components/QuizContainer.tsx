"use client";

import { QuizContent, QuizState, UserAnswer } from "../types/quiz.types";
import { useState, useEffect, useRef } from "react";
import { QuizResult } from "./QuizResult";
import { ArrowLeft } from "lucide-react";
import { scoreCalculator } from "../utils/scoreCalculator";
import { Button } from "@/components/ui/button";
import { QuestionRenderer } from "./QuestionRenderer";
import Link from "next/link";
import { quizValidator } from "../utils/quizValidator";

interface QuizContainerProps {
  quiz: QuizContent;
  onExit: () => void;
  onComplete: (
    score: number,
    maxScore: number,
    userAnswers: Record<string, UserAnswer>
  ) => void;
  onTextSelection: () => void;
}

export function QuizContainer({
  quiz,
  onExit,
  onComplete,
  onTextSelection,
}: QuizContainerProps) {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    userAnswers: {},
    isSubmitted: false,
    showResults: false,
  });

  console.log('onTextSelection',onTextSelection);

  // Time tracking
  const [questionStartTime, setQuestionStartTime] = useState<number>(
    Date.now()
  );
  const [questionTimes, setQuestionTimes] = useState<Record<string, number>>(
    {}
  );
  const [totalTime, setTotalTime] = useState<number>(0);
  const totalStartTime = useRef<number>(Date.now());

  const currentQuestion = quiz.questions[quizState.currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress =
    ((quizState.currentQuestionIndex + 1) / totalQuestions) * 100;

  // Reset question start time when question changes
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [quizState.currentQuestionIndex]);

  const handleAnswer = (answer: UserAnswer) => {
    setQuizState((prev: QuizState) => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [currentQuestion.id]: answer,
      },
    }));
  };

  const handleNext = () => {
    // Save time for current question before moving
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    setQuestionTimes((prev) => ({
      ...prev,
      [currentQuestion.id]: timeTaken,
    }));

    if (quizState.currentQuestionIndex < totalQuestions - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    }
  };

  const handlePrevious = () => {
    // Save time for current question before moving
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    setQuestionTimes((prev) => ({
      ...prev,
      [currentQuestion.id]: timeTaken,
    }));

    if (quizState.currentQuestionIndex > 0) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
    }
  };

  const handleSubmit = () => {
    // Calculate final time for current question if answered
    const finalQuestionTime = Math.floor(
      (Date.now() - questionStartTime) / 1000
    );
    const finalQuestionTimes = {
      ...questionTimes,
      [currentQuestion.id]:
        questionTimes[currentQuestion.id] || finalQuestionTime,
    };

    // Calculate and store total time taken
    const calculatedTotalTime = Math.floor(
      (Date.now() - totalStartTime.current) / 1000
    );
    setTotalTime(calculatedTotalTime);

    const { totalScore, maxScore, percentage } = scoreCalculator.calculateScore(
      quiz.questions,
      quizState.userAnswers
    );

    setQuizState((prev) => ({
      ...prev,
      isSubmitted: true,
      showResults: true,
    }));

    // Format answers for database with is_correct and time_taken
    const formattedAnswers = quiz.questions.map((q) => {
      const userAnswer = quizState.userAnswers[q.id];
      const isCorrect = quizValidator.isAnswerCorrect(q, userAnswer);
      const timeTaken = finalQuestionTimes[q.id] || 0;

      return {
        question_id: q.id,
        selected_option: userAnswer?.selectedOptionId || null,
        text_answer: userAnswer?.textAnswer || null,
        is_correct: isCorrect,
        time_taken: timeTaken,
      };
    });

    onComplete(totalScore, maxScore, {
      ...quizState.userAnswers,
      _formattedAnswers: formattedAnswers,
      _totalTime: calculatedTotalTime,
    } as any);
  };

  const handleRetry = () => {
    setQuizState({
      currentQuestionIndex: 0,
      userAnswers: {},
      isSubmitted: false,
      showResults: false,
    });
    setQuestionTimes({});
    setQuestionStartTime(Date.now());
    setTotalTime(0);
    totalStartTime.current = Date.now();
  };

  const isQuestionAnswered = (questionId: string) => {
    const answer = quizState.userAnswers[questionId];
    if (!answer) return false;
    return !!(answer.selectedOptionId || answer.textAnswer);
  };

  const answeredCount = quiz.questions.filter((q) =>
    isQuestionAnswered(q.id)
  ).length;

  if (quizState.showResults) {
    return (
      <QuizResult
        quiz={quiz}
        userAnswers={{ ...quizState.userAnswers, _totalTime: totalTime } as any}
        onRetry={handleRetry}
        onExit={onExit}
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-white dark:bg-background py-8 clay-shadow"
      onMouseUp={onTextSelection}
    >
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back Button */}
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reading
        </button>

        {/* Quiz Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Reading Comprehension Quiz
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choose the best answer for each question based on the text.
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Question {quizState.currentQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>
          {/* Orange Progress Bar */}
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card with Claymorphism */}
        <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-8 mb-6">
          <QuestionRenderer
            question={currentQuestion}
            userAnswer={quizState.userAnswers[currentQuestion.id]}
            onAnswer={handleAnswer}
            isSubmitted={quizState.isSubmitted}
            showFeedback={quizState.isSubmitted}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          {/* Previous Button */}
          <Button
            onClick={handlePrevious}
            disabled={quizState.currentQuestionIndex === 0}
            variant="outline"
            className="rounded-3xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 px-8 py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </Button>

          {/* Next or Submit Button */}
          {quizState.currentQuestionIndex === totalQuestions - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!isQuestionAnswered(currentQuestion.id)}
              className="rounded-3xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300 px-12 py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isQuestionAnswered(currentQuestion.id)}
              className="rounded-3xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300 px-12 py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
