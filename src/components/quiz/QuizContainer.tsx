"use client";

import { useState } from "react";
import { QuizQuestion as QuizQuestionType } from "@/types/content.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuizQuestion } from "./QuizQuestion";
import { QuizResult } from "./QuizResult";
import { useSubmitQuiz } from "@/lib/hooks/useReading";
import { ArrowLeft } from "lucide-react";

interface QuizContainerProps {
  questions: QuizQuestionType[];
  contentType: "reading" | "listening" | "grammar";
  contentId: string;
  onComplete: () => void;
}

export function QuizContainer({
  questions,
  contentType,
  contentId,
  onComplete,
}: QuizContainerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const submitQuiz = useSubmitQuiz();

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...userAnswers, answerIndex];
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed
      const score = newAnswers.reduce((acc, answer, index) => {
        return acc + (answer === questions[index].correct_answer ? 1 : 0);
      }, 0);

      submitQuiz.mutate({
        contentType,
        contentId,
        score,
        totalQuestions: questions.length,
        answers: newAnswers,
      });

      setShowResults(true);
    }
  };

  if (showResults) {
    const score = userAnswers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correct_answer ? 1 : 0);
    }, 0);

    return (
      <QuizResult
        score={score}
        totalQuestions={questions.length}
        questions={questions}
        userAnswers={userAnswers}
        onRetry={() => {
          setCurrentQuestionIndex(0);
          setUserAnswers([]);
          setShowResults(false);
        }}
        onExit={onComplete}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" className="mb-4" onClick={onComplete}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Exit Quiz
      </Button>

      <Card>
        <CardHeader>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle>Quiz</CardTitle>
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent>
          <QuizQuestion question={currentQuestion} onAnswer={handleAnswer} />
        </CardContent>
      </Card>
    </div>
  );
}
