"use client";

import { Progress } from "@/shared/components/ui/progress";
import { CheckCircle2 } from "lucide-react";

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredCount: number;
  progress: number;
}

export function QuizProgress({
  currentQuestion,
  totalQuestions,
  answeredCount,
  progress,
}: QuizProgressProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            Question {currentQuestion} of {totalQuestions}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CheckCircle2 className="h-4 w-4" />
          <span>
            {answeredCount} / {totalQuestions} answered
          </span>
        </div>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
