"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuizContainer } from "@/features/quiz/components/QuizContainer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlayCircleIcon, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AudioPlayer } from "@/features/reading/components/AudioPlayer";
import { AddWordDialog } from "@/features/words/components/addWordDialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useQuiz, useQuizFromId } from "@/features/quiz/hooks/useQuiz";
import { useQuizSubmit } from "@/features/quiz/hooks/useQuizSubmit";
import { useReadingDetail } from "@/features/reading/hooks/useReading";

export default function ReadingDetailPage() {
  // ✅ unwrap async params
  const { id: contentId, level } = useParams() as { id: string; level: string };

  const router = useRouter();
  const { user, profile, isPremium } = useAuth();
  const { data: reading, isLoading } = useReadingDetail(contentId);
  const { data: quizQuestions } = useQuizFromId(
    reading?.quiz_content_id || ""
  );
  const submitQuiz = useQuizSubmit();

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

  const handleQuizComplete = async (score: number, maxScore: number) => {
    if (!user || !quiz) return;

    await submitQuiz.mutateAsync({
      quiz_content_id: quiz.id,
      answers: [],
      total_score: score,
      max_score: maxScore,
      percentage: (score / maxScore) * 100,
    });
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!reading) {
    return <div className="container mx-auto px-4 py-8">Reading not found</div>;
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => router.push(`/reading/${level}`)}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to {level} Texts
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge>{reading.level}</Badge>
            <span className="text-sm text-muted-foreground">
              {reading.word_count} words
            </span>
          </div>
          <CardTitle className="text-3xl mt-2">{reading.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <AudioPlayer audioUrl={reading.audio_url} />

          <div
            className="prose prose-lg max-w-none"
            onMouseUp={handleTextSelection}
          >
            {reading.content.split("\n\n").map((p, i) => (
              <p key={i} className="mb-4 leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          <div className="flex gap-4">
            <Button
              className="flex-1"
              size="lg"
              onClick={() => setShowQuiz(true)}
              disabled={!quiz}
            >
              <PlayCircleIcon className="mr-2 h-5 w-5" />
              Take Quiz
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedText("");
                setShowAddWord(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Word
            </Button>
          </div>
        </CardContent>
      </Card>

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
