'use client';

import { useState } from "react";
import { useQuizFromId } from "@/features/quiz/hooks/useQuiz";
import { useQuizSubmit } from "@/features/quiz/hooks/useQuizSubmit";
import { useReadingDetail } from "./useReading";
import type { Quiz } from "@/shared/types/model/question.types";

/**
 * useReadingDetailLogic Hook
 * 
 * Handles business logic for reading detail page including:
 * - Reading content fetching
 * - Quiz integration
 * - Word selection
 * - Quiz submission
 * 
 * @param contentId - Reading content ID
 * @param userId - Current user ID
 */
export function useReadingDetailLogic(contentId: string, userId?: string) {
  const { data: reading, isLoading } = useReadingDetail(contentId);
  const { data: quizQuestions } = useQuizFromId(reading?.id || "");
  const submitQuiz = useQuizSubmit();

  const [showQuiz, setShowQuiz] = useState(false);
  const [showAddWord, setShowAddWord] = useState(false);
  const [selectedText, setSelectedText] = useState("");

  // Transform quiz questions array to QuizContent object
  const quiz: Quiz | null =
    quizQuestions && quizQuestions.length > 0
      ? {
          id: contentId,
          title: reading?.title || "Quiz",
          questions: quizQuestions,
        }
      : null;

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
    > & { _formattedAnswers?: any[]; _totalTime?: number }
  ) => {
    if (!userId || !quiz) return;

    // Use formatted answers if available (includes is_correct and time_taken)
    const answers = userAnswers._formattedAnswers || Object.entries(userAnswers)
      .filter(([key, _]) => !key.startsWith('_')) // Filter out metadata fields
      .map(([_, answer]) => {
        const ans = answer as { 
          question_id: string; 
          type: string; 
          selectedOptionId?: string | null; 
          textAnswer?: string | null 
        };
        const question = quiz.questions.find((q) => q.id === ans.question_id);
        const selectedOption = question?.options.find(
          (opt: { id: string; is_correct: boolean }) =>
            opt.id === ans.selectedOptionId
        );

        return {
          question_id: ans.question_id,
          selected_option: ans.selectedOptionId
            ? parseInt(ans.selectedOptionId)
            : null,
          text_answer: ans.textAnswer || null,
          is_correct: selectedOption?.is_correct || false,
          time_taken: 0,
        };
      });

    await submitQuiz.mutateAsync({
      content_id: quiz.id,
      answers,
      score: score,
      max_score: maxScore,
      percentage: (score / maxScore) * 100,
    });
  };

  return {
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
  };
}
