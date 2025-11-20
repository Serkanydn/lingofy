"use client";

import { use } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { QuizContainer } from "@/features/quiz/components/QuizContainer";
import { AddWordDialog } from "@/features/words/components/addWordDialog";
import { Breadcrumb } from "../components/Breadcrumb";
import {
  ListeningContentCard,
  LoadingState,
  NotFoundState,
} from "../components/ListeningContentCard";
import { useListeningDetailLogic } from "../hooks/useListeningDetailLogic";

interface ListeningDetailPageClientProps {
  params: Promise<{ level: string; id: string }>;
}

/**
 * ListeningDetailPageClient Component
 *
 * Main client component for listening exercise detail page.
 * Handles quiz display, transcript visibility, and word addition.
 *
 * @component
 */
export function ListeningDetailPageClient({
  params,
}: ListeningDetailPageClientProps) {
  const { level: paramLevel, id } = use(params);
  const level = paramLevel.toUpperCase();
  const { user } = useAuth();

  const {
    listening,
    isLoading,
    quiz,
    showQuiz,
    setShowQuiz,
    showTranscript,
    setShowTranscript,
    showAddWord,
    setShowAddWord,
    selectedText,
    setSelectedText,
    handleTextSelection,
    handleQuizComplete,
  } = useListeningDetailLogic(id, user?.id);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!listening) {
    return <NotFoundState level={level} />;
  }

  if (showQuiz && quiz) {
    return (
      <>
        <QuizContainer
          quiz={quiz}
          onExit={() => setShowQuiz(false)}
          onComplete={handleQuizComplete}
          onTextSelection={handleTextSelection}
        />
        <AddWordDialog
          open={showAddWord}
          onClose={() => setShowAddWord(false)}
          initialWord={selectedText}
          sourceType="listening"
          sourceId={id}
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
        <Breadcrumb
          items={[
            { label: "Listening Hub", href: "/listening" },
            { label: level, href: `/listening/${level}` },
            { label: listening.title },
          ]}
        />

        <ListeningContentCard
          listening={listening}
          level={level}
          showTranscript={showTranscript}
          onToggleTranscript={() => setShowTranscript(!showTranscript)}
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
        sourceType="listening"
        sourceId={id}
      />
    </div>
  );
}
