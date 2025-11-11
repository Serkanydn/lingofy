"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { QuizContainer } from "@/features/quiz/components/QuizContainer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlayCircleIcon, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AudioPlayer } from "@/features/reading/components/AudioPlayer";
import { AddWordDialog } from "@/features/words/components/addWordDialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useQuiz, useQuizFromId } from "@/features/quiz/hooks/useQuiz";
import { useQuizSubmit } from "@/features/quiz/hooks/useQuizSubmit";
import { useReadingDetail } from "@/features/reading/hooks/useReading";
import { cn } from "@/shared/lib/utils";

export default function ReadingDetailPage() {
  // ✅ unwrap async params
  const { id: contentId, level } = useParams() as { id: string; level: string };

  const router = useRouter();
  const { user, profile, isPremium } = useAuth();
  const { data: reading, isLoading } = useReadingDetail(contentId);
  console.log("reading", reading);
  const { data: quizQuestions } = useQuizFromId(reading?.id || "");
  const submitQuiz = useQuizSubmit();

  console.log("quizQuestions", quizQuestions);

  // Transform quiz questions array to QuizContent object
  const quiz =
    quizQuestions && quizQuestions.length > 0
      ? {
          id: contentId,
          title: reading?.title || "Quiz",
          questions: quizQuestions,
        }
      : null;

  console.log("quiz", quiz);

  const [showQuiz, setShowQuiz] = useState(false);
  const [showAddWord, setShowAddWord] = useState(false);
  const [selectedText, setSelectedText] = useState("");

  const handleTextSelection = () => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      setSelectedText(selection);
      setShowAddWord(true);
    }
  };

  const handleQuizComplete = async (
    score: number,
    maxScore: number,
    userAnswers: Record<
      string,
      {
        question_id: string;
        type: "option" | "text";
        selectedOptionId?: string | null;
        textAnswer?: string | null;
      }
    >
  ) => {
    if (!user || !quiz) return;

    // Transform userAnswers to QuizAnswer format
    const answers = Object.values(userAnswers).map((answer) => {
      const question = quiz.questions.find((q) => q.id === answer.question_id);
      const selectedOption = question?.options.find(
        (opt: { id: string; is_correct: boolean }) =>
          opt.id === answer.selectedOptionId
      );

      return {
        question_id: answer.question_id,
        selected_option: answer.selectedOptionId
          ? parseInt(answer.selectedOptionId)
          : 0,
        is_correct: selectedOption?.is_correct || false,
        time_taken: 0,
      };
    });

    await submitQuiz.mutateAsync({
      content_id: quiz.id,
      answers,
      score: score,
      max_score: maxScore,
      percentage: (score / maxScore) * 100,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-48" />
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64" />
            <div className="bg-white dark:bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!reading) {
    return (
      <div className="min-h-screen bg-white dark:bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-6">
              <span className="text-5xl">📖</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Article not found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The reading article you're looking for doesn't exist.
            </p>
            <Link href={`/reading/${level}`}>
              <Button className="rounded-2xl bg-orange-500 hover:bg-orange-600 text-white">
                Back to Articles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showQuiz && quiz) {
    return (
      <QuizContainer
        quiz={quiz}
        onExit={() => setShowQuiz(false)}
        onComplete={handleQuizComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background py-8 clay-shadow">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <div className=" mb-6">
          <Link
            href="/reading"
            className="text-sm text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-500 transition-colors"
          >
            Reading Hub
          </Link>
          <span className="text-sm text-gray-400 mx-2">/</span>
          <Link
            href={`/reading/${level}`}
            className="text-sm text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-500 transition-colors"
          >
            {level}
          </Link>
          <span className="text-sm text-gray-400 mx-2">/</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {reading.title}
          </span>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden grid gap-6 p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1 text-sm">
              {reading.level} {level}
            </Badge>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {/* • {reading.word_count || 0} min read */}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {reading.title}
          </h1>

          {/* Audio Player Section */}
          <AudioPlayer audioUrl={reading.audio_url} />

          {/* Content Section */}
          <div
            className="prose prose-lg max-w-none dark:prose-invert"
            onMouseUp={handleTextSelection}
          >
            {reading.content.split("\n\n").map((paragraph, i) => (
              <p
                key={i}
                className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 ">
            <Button
              className="flex-1 rounded-3xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300 py-6 text-lg"
              onClick={() => setShowQuiz(true)}
              disabled={!quiz}
            >
              <PlayCircleIcon className="mr-2 h-6 w-6" />
              Take the Quiz
            </Button>
            <Button
              variant="outline"
              className="rounded-3xl px-6 py-6 border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300"
              onClick={() => {
                setSelectedText("");
                setShowAddWord(true);
              }}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <AddWordDialog
        open={showAddWord}
        onClose={() => setShowAddWord(false)}
        initialWord={selectedText}
        sourceType="reading"
        sourceId={contentId}
      />
    </div>
  );
}
