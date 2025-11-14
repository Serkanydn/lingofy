"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Lightbulb, FileText } from "lucide-react";
import { QuizContainer } from "@/features/quiz/components/QuizContainer";
import { AddWordDialog } from "@/features/words/components/addWordDialog";
import { useGrammarTopicLogic } from "../hooks/useGrammarTopicLogic";
import { Breadcrumb } from "../components/Breadcrumb";
import { TopicHeader, ContentSection } from "../components/Headers";
import { ActionButtons } from "../components/ActionButtons";
import { EmptyState } from "../components/EmptyState";
import { useQuizLimit } from "@/features/statistics/hooks/useQuizLimit";
import { QuizLimitWarning } from "@/features/statistics/components/QuizLimitWarning";

interface GrammarTopicPageClientProps {
  categorySlug: string;
  topicId: string;
}

/**
 * GrammarTopicPageClient Component
 *
 * Topic detail page showing explanation, examples, practice text, and quiz.
 * Features:
 * - Breadcrumb navigation
 * - Topic header with FREE/GRAMMAR badges
 * - Content sections: Explanation, Examples, Practice Text
 * - Text selection for word addition
 * - Quiz integration
 * - Add word dialog
 * - Loading skeleton
 * - Not found state
 *
 * @component
 */
export function GrammarTopicPageClient({
  categorySlug,
  topicId,
}: GrammarTopicPageClientProps) {
  const {
    topic,
    quizQuestions,
    showQuiz,
    showAddWord,
    selectedText,
    isLoading,
    handleTextSelection,
    handleQuizComplete,
    handleStartQuiz,
    handleExitQuiz,
    handleAddWord,
    handleCloseAddWord,
  } = useGrammarTopicLogic(topicId);

  const { canTake, remaining, used, isPremium, maxQuizzes } = useQuizLimit();

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
          <EmptyState
            emoji="📚"
            title="Topic not found"
            description="The grammar topic you're looking for doesn't exist."
          />
          <div className="flex justify-center mt-6">
            <Link href={`/grammar/${categorySlug}`}>
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
      <>
        <QuizContainer
          quiz={{
            id: topicId,
            title: topic.title,
            questions: quizQuestions,
          }}
          onExit={handleExitQuiz}
          onComplete={handleQuizComplete}
          onTextSelection={handleTextSelection}
        />
        <AddWordDialog
          open={showAddWord}
          onClose={handleCloseAddWord}
          initialWord={selectedText}
        />
      </>
    );
  }

  return (
    <div
      className="min-h-screen bg-white dark:bg-background py-8"
      onMouseUp={handleTextSelection}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Grammar Hub", href: "/grammar" },
            { label: categorySlug, href: `/grammar/${categorySlug}` },
            { label: topic.title },
          ]}
        />

        {/* Quiz Limit Warning */}
        {!isPremium && (
          <div className="mb-6">
            <QuizLimitWarning
              remaining={remaining}
              used={used}
              maxQuizzes={maxQuizzes}
            />
          </div>
        )}

        {/* Content Card */}
        <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden p-8">
          {/* Header */}
          <TopicHeader title={topic.title} />

          {/* Explanation Section */}
          <ContentSection
            section={{
              title: "Explanation",
              icon: BookOpen,
              content: topic.explanation,
              bgColor:
                "bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800",
              iconColor:
                "bg-linear-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/10 text-blue-600 dark:text-blue-400",
              onTextSelect: handleTextSelection,
            }}
          />

          {/* Examples Section */}
          <ContentSection
            section={{
              title: "Examples",
              icon: Lightbulb,
              content: topic.examples,
              bgColor:
                "bg-amber-50 dark:bg-amber-900/10 border-amber-500 dark:border-amber-600",
              iconColor:
                "bg-linear-to-br from-amber-100 to-amber-50 dark:from-amber-900/20 dark:to-amber-800/10 text-amber-600 dark:text-amber-400",
              onTextSelect: handleTextSelection,
            }}
          />

          {/* Practice Text Section */}
          <ContentSection
            section={{
              title: "Practice Text",
              icon: FileText,
              content: topic.mini_text,
              bgColor:
                "bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800",
              iconColor:
                "bg-linear-to-br from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/10 text-purple-600 dark:text-purple-400",
              onTextSelect: handleTextSelection,
            }}
          />

          {/* Action Buttons */}
          <ActionButtons
            hasQuiz={!!quizQuestions?.length}
            onStartQuiz={handleStartQuiz}
            onAddWord={handleAddWord}
            disabled={!canTake}
          />
        </div>
      </div>

      <AddWordDialog
        open={showAddWord}
        onClose={handleCloseAddWord}
        initialWord={selectedText}
      />
    </div>
  );
}
