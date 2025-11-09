"use client";

import { useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { QuizContainer } from "@/features/quiz/components/QuizContainer";
import { ListeningPlayer } from "@/features/listening/components/ListeningPlayer";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useQuizSubmit } from "@/features/quiz/hooks/useQuizSubmit";
import {
  useListeningDetail,
  useListeningQuiz,
} from "@/features/listening/hooks/useListening";

export default function ListeningDetailPage({
  params,
}: {
  params: Promise<{ level: string; id: string }>;
}) {
  const { level, id } = use(params)
  const { user } = useAuth();
  const { data: listening, isLoading } = useListeningDetail(id);
  const { data: quizQuestions } = useListeningQuiz(id);
  const submitQuiz = useQuizSubmit();
  const [showQuiz, setShowQuiz] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const handleQuizComplete = async (
    score: number,
    maxScore: number,
    userAnswers: Record<string, { question_id: string; type: "option" | "text"; selectedOptionId?: string | null; textAnswer?: string | null }>
  ) => {
    if (!user || !quizQuestions) return;

    // Transform userAnswers to QuizAnswer format
    const answers = Object.values(userAnswers).map((answer) => {
      const question = quizQuestions.find((q) => q.id === answer.question_id);
      const selectedOption = question?.options.find((opt: { id: string; is_correct: boolean }) => opt.id === answer.selectedOptionId);
      
      return {
        question_id: answer.question_id,
        selected_option: answer.selectedOptionId ? parseInt(answer.selectedOptionId) : 0,
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

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!listening) {
    return (
      <div className="container mx-auto px-4 py-8">Listening not found</div>
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href={`/listening/${level}`}>
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {level} Listening
        </Button>
      </Link>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge>{listening.level}</Badge>
            <span className="text-sm text-muted-foreground">
              {Math.floor(listening.duration_seconds / 60)}:
              {String(listening.duration_seconds % 60).padStart(2, "0")} min
            </span>
          </div>
          <CardTitle className="text-3xl mt-2">{listening.title}</CardTitle>
          {listening.description && (
            <p className="text-muted-foreground mt-2">
              {listening.description}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <ListeningPlayer
            audioUrl={listening.audio_url}
            duration={listening.duration_seconds}
          />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Listen carefully and try to understand
              the main ideas. You can adjust the playback speed if needed. Take
              the quiz when you're ready!
            </p>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={() => setShowQuiz(true)}
          >
            Take Quiz
          </Button>

          {showTranscript && listening.transcript && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Transcript</h3>
                </div>
                <div className="prose prose-lg max-w-none bg-muted/50 p-6 rounded-lg">
                  {listening.transcript
                    .split("\n\n")
                    .map((paragraph, index) => (
                      <p key={index} className="mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                </div>
              </div>
            </>
          )}

          {!showTranscript && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowTranscript(true)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Show Transcript
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
