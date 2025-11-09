"use client";

import { useState } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { QuizContainer } from "@/features/quiz/components/QuizContainer";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useQuizSubmit } from "@/features/quiz/hooks/useQuizSubmit";
import {
  useGrammarDetail,
  useGrammarQuiz,
} from "@/features/grammar/hooks/useGrammar";
import { useQuiz, useQuizFromId } from "@/features/quiz/hooks/useQuiz";

export default function GrammarTopicPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  // ✅ Unwrap the async params with React.use()
  const { category, id } = React.use(params);
  const { user } = useAuth();
  const { data: topic, isLoading } = useGrammarDetail(id);
  console.log('topic',topic);
  const { data: quizQuestions } = useQuizFromId(topic?.id || "");
  const submitQuiz = useQuizSubmit();
  const [showQuiz, setShowQuiz] = useState(false);

  console.log('quizQuestions',quizQuestions);

  const handleQuizComplete = async (
    score: number,
    maxScore: number,
    userAnswers: Record<string, { question_id: string; type: "option" | "text"; selectedOptionId?: string | null; textAnswer?: string | null }>
  ) => {
    if (!user || !quizQuestions || !topic) return;

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
      content_id: topic.id,
      answers,
      score: score,
      max_score: maxScore,
      percentage: (score / maxScore) * 100,
    });
  };
  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!topic) {
    return <div className="container mx-auto px-4 py-8">Topic not found</div>;
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href={`/grammar/${category}`}>
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Topics
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{topic.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Explanation */}
          <div>
            <h3 className="text-xl font-semibold mb-3">📚 Explanation</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-lg leading-relaxed">{topic.explanation}</p>
            </div>
          </div>

          <Separator />

          {/* Examples */}
          <div>
            <h3 className="text-xl font-semibold mb-3">💡 Examples</h3>
            <div className="space-y-3">
              {topic.examples.map((example, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-muted/50 rounded-lg p-4"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <p className="text-lg">{example}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Mini Text */}
          <div>
            <h3 className="text-xl font-semibold mb-3">📖 Practice Text</h3>
            <div className="bg-linear-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">
                {topic.mini_text}
              </p>
            </div>
          </div>
          {!!quizQuestions?.length && (
            <>
              <Separator />

              <Button
                className="w-full"
                size="lg"
                onClick={() => setShowQuiz(true)}
              >
                Take Quiz
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
