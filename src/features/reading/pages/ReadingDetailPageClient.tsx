'use client';

import { useParams } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { QuizContainer } from "@/features/quiz/components/QuizContainer";
import { AddWordDialog } from "@/features/words/components/addWordDialog";
import { Breadcrumb } from "../components/Breadcrumb";
import { ReadingContentCard } from "../components/ReadingContentCard";
import { LoadingState, NotFoundState } from "../components/ReadingContentCard";
import { useReadingDetailLogic } from "../hooks/useReadingDetailLogic";

/**
 * ReadingDetailPageClient Component
 * 
 * Main client component for reading article detail page.
 * Handles quiz display, word addition, and text selection.
 * 
 * @component
 */
export function ReadingDetailPageClient() {
  const { id: contentId, level } = useParams() as { id: string; level: string };
  const { user } = useAuth();
  
  const {
    reading,
    isLoading,
    quiz,
    showQuiz,
    setShowQuiz,
    showAddWord,
    setShowAddWord,
    selectedText,
    setSelectedText,
    handleTextSelection,
    handleQuizComplete,
  } = useReadingDetailLogic(contentId, user?.id);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!reading) {
    return <NotFoundState level={level} />;
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
        <Breadcrumb
          items={[
            { label: "Reading Hub", href: "/reading" },
            { label: level, href: `/reading/${level}` },
            { label: reading.title },
          ]}
        />

        <ReadingContentCard
          reading={reading}
          level={level}
          onQuizClick={() => setShowQuiz(true)}
          onAddWordClick={() => {
            setSelectedText("");
            setShowAddWord(true);
          }}
          onTextSelection={handleTextSelection}
          hasQuiz={!!quiz}
        />
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
