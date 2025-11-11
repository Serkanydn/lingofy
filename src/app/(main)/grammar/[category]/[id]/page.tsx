"use client";

import { useState } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlayCircleIcon, BookOpen, Lightbulb, FileText } from "lucide-react";
import { QuizContainer } from "@/features/quiz/components/QuizContainer";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useQuizSubmit } from "@/features/quiz/hooks/useQuizSubmit";
import { useGrammarDetail } from "@/features/grammar/hooks/useGrammar";
import { useQuizFromId } from "@/features/quiz/hooks/useQuiz";
import { Badge } from "@/components/ui/badge";

export default function GrammarTopicPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = React.use(params);
  const { user } = useAuth();
  const { data: topic, isLoading } = useGrammarDetail(id);
  const { data: quizQuestions } = useQuizFromId(topic?.id || "");
  const submitQuiz = useQuizSubmit();
  const [showQuiz, setShowQuiz] = useState(false);

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
    if (!user || !quizQuestions || !topic) return;

    // Transform userAnswers to QuizAnswer format
    const answers = Object.values(userAnswers).map((answer) => {
      const question = quizQuestions.find((q) => q.id === answer.question_id);
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
      content_id: topic.id,
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

  if (!topic) {
    return (
      <div className="min-h-screen bg-white dark:bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-6">
              <span className="text-5xl">📚</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Topic not found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The grammar topic you're looking for doesn't exist.
            </p>
            <Link href={`/grammar/${category}`}>
              <Button className="rounded-2xl bg-orange-500 hover:bg-orange-600 text-white">
                Back to Topics
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
          title: topic.title,
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
            href="/grammar"
            className="text-sm text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-500 transition-colors"
          >
            Grammar Hub
          </Link>
          <span className="text-sm text-gray-400 mx-2">/</span>
          <Link
            href={`/grammar/${category}`}
            className="text-sm text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-500 transition-colors"
          >
            {category}
          </Link>
          <span className="text-sm text-gray-400 mx-2">/</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {topic.title}
          </span>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 text-sm rounded-full">
              FREE
            </Badge>
            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1 text-sm rounded-full">
              GRAMMAR
            </Badge>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            {topic.title}
          </h1>

          {/* Explanation Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.1)]">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Explanation
              </h2>
            </div>
            <div className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {topic.explanation}
              </p>
            </div>
          </div>

          {/* Examples Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-100 to-amber-50 dark:from-amber-900/20 dark:to-amber-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.1)]">
                <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Examples
              </h2>
            </div>
            <div className="space-y-3">
              {topic.examples.map((example, index) => (
                <div
                  key={index}
                  className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 dark:border-amber-600 rounded-r-2xl p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-amber-600 dark:text-amber-400 font-bold text-lg shrink-0">
                      {index + 1}.
                    </span>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      {example}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practice Text Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.1)]">
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Practice Text
              </h2>
            </div>
            <div className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-2xl p-6">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {topic.mini_text}
              </p>
            </div>
          </div>

          {/* Quiz Button */}
          {!!quizQuestions?.length && (
            <Button
              className="w-full rounded-3xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300 py-6 text-lg"
              onClick={() => setShowQuiz(true)}
            >
              <PlayCircleIcon className="mr-2 h-6 w-6" />
              Take the Quiz
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
