"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { QuizContainer } from "@/features/quiz/components/QuizContainer";
import { Button } from "@/components/ui/button";
import { PlayCircleIcon, FileText, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AudioPlayer } from "@/features/reading/components/AudioPlayer";
import { AddWordDialog } from "@/features/words/components/addWordDialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useQuizSubmit } from "@/features/quiz/hooks/useQuizSubmit";
import { Level } from "@/shared/types/common.types";
import { QuizQuestion } from "@/features/quiz/types/quiz.types";
import { useListeningDetail, useListeningQuestions } from "@/features/listening/hooks/useListening";

export default function ListeningDetailPage({
  params,
}: {
  params: Promise<{ level: string; id: string }>;
}) {
  const { level: paramLevel, id } = use(params);
  const level = paramLevel.toUpperCase() as Level;
  const { user } = useAuth();
  const submitQuiz = useQuizSubmit();
  
  // Fetch data from database
  const { data: listening, isLoading: isLoadingListening } = useListeningDetail(id);
  const { data: questions, isLoading: isLoadingQuestions } = useListeningQuestions(id);
  
  const isLoading = isLoadingListening || isLoadingQuestions;

  // Transform questions to QuizQuestion format
  const quizQuestions: QuizQuestion[] | undefined = questions?.map((q: any) => ({
    id: q.id,
    content_id: id,
    content_type: "listening" as const,
    text: q.text,
    type: q.type,
    options: q.options?.map((opt: any, idx: number) => ({
      id: `${q.id}-${idx}`,
      text: opt.text,
      is_correct: opt.is_correct,
    })) || [],
    correct_answer: q.type === 'fill_blank' ? undefined : q.options?.findIndex((opt: any) => opt.is_correct),
    explanation: q.explanation,
    order_index: q.order_index,
    points: q.points || 1,
  }));

  const [showQuiz, setShowQuiz] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
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
    if (!user || !quizQuestions) return;

    // Transform userAnswers to QuizAnswer format
    const answers = Object.values(userAnswers).map((answer) => {
      const question = quizQuestions.find((q) => q.id === answer.question_id);
      const selectedOption = question?.options.find(
        (opt) => opt.id === answer.selectedOptionId
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
      content_id: id,
      answers,
      score: score,
      max_score: maxScore,
      percentage: (score / maxScore) * 100,
    });

    setShowQuiz(false);
    setShowTranscript(true);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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

  if (!listening) {
    return (
      <div className="min-h-screen bg-white dark:bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-6">
              <span className="text-5xl">🎧</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Listening exercise not found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The listening exercise you're looking for doesn't exist.
            </p>
            <Link href={`/listening/${level}`}>
              <Button className="rounded-2xl bg-orange-500 hover:bg-orange-600 text-white">
                Back to Exercises
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showQuiz && quizQuestions) {
    return (
      <QuizContainer
        quiz={{
          id: id,
          title: listening.title,
          questions: quizQuestions,
        }}
        onExit={() => setShowQuiz(false)}
        onComplete={handleQuizComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/listening"
            className="text-sm text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-500 transition-colors"
          >
            Listening Hub
          </Link>
          <span className="text-sm text-gray-400 mx-2">/</span>
          <Link
            href={`/listening/${level}`}
            className="text-sm text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-500 transition-colors"
          >
            {level}
          </Link>
          <span className="text-sm text-gray-400 mx-2">/</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {listening.title}
          </span>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1 text-sm rounded-full">
              {listening.level}
            </Badge>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              • {formatDuration(listening.duration_seconds)}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {listening.title}
          </h1>

          {listening.description && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              {listening.description}
            </p>
          )}

          {/* Audio Player Section */}
          <div className="mb-8">
            {listening.audio_asset && (
              <AudioPlayer
                audioAsset={listening.audio_asset as any}
                title={listening.title}
              />
            )}
          </div>

          {/* Tip Card */}
          <div className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-5 mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
              <span className="text-2xl mr-2">💡</span>
              <strong>Listening Tip:</strong> Listen carefully and try to
              understand the main ideas. You can replay the audio as many times
              as needed. Take the quiz when you're ready to test your
              comprehension!
            </p>
          </div>

          {/* Transcript Section */}
          {listening.transcript && (
            <div className="mb-6">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="w-full flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Transcript
                  </span>
                </div>
                {showTranscript ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>

              {showTranscript && (
                <div className="mt-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
                  <div 
                    className="prose prose-lg max-w-none dark:prose-invert"
                    onMouseUp={handleTextSelection}
                  >
                    {listening.transcript.split("\n\n").map((paragraph, i) => (
                      <p
                        key={i}
                        className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              className="flex-1 rounded-3xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300 py-6 text-lg"
              onClick={() => setShowQuiz(true)}
              disabled={!quizQuestions}
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
        sourceType="listening"
        sourceId={id}
      />
    </div>
  );
}
