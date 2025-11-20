'use client';

import { useState } from "react";
import { useListeningDetail, useListeningQuestions } from "./useListening";
import { useQuizSubmit } from "@/features/quiz/hooks/useQuizSubmit";
import type { Question, Quiz } from "@/shared/types/model/question.types";

/**
 * useListeningDetailLogic Hook
 * 
 * Handles business logic for listening detail page including:
 * - Listening content fetching
 * - Quiz integration with questions transformation
 * - Transcript visibility
 * - Text selection for vocabulary
 * - Quiz submission
 * 
 * @param contentId - Listening content ID
 * @param userId - Current user ID
 */
export function useListeningDetailLogic(contentId: string, userId?: string) {
  const { data: listening, isLoading: isLoadingListening } = useListeningDetail(contentId);
  const { data: questions, isLoading: isLoadingQuestions } = useListeningQuestions(contentId);
  const submitQuiz = useQuizSubmit();

  const isLoading = isLoadingListening || isLoadingQuestions;

  // Transform questions to QuizQuestion format
  const quizQuestions: Question[] | undefined = questions?.map((q: any) => ({
    id: q.id,
    content_id: contentId,
    content_type: "listening" as const,
    text: q.text,
    type: q.type,
    options: q.options?.map((opt: any, idx: number) => ({
      id: `${q.id}-${idx}`,
      text: opt.text,
      is_correct: opt.is_correct,
    })) || [],
    correct_answer: q.type === 'fill_blank' ? undefined : q.options?.findIndex((opt: any) => opt.is_correct),
    explanation: q.explanation,
    order: q.order,
    points: q.points || 1,
  }));

  const quiz: Quiz | null = quizQuestions && quizQuestions.length > 0
    ? {
        id: contentId,
        title: listening?.title || "Quiz",
        questions: quizQuestions,
      }
    : null;

  const [showQuiz, setShowQuiz] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showAddWord, setShowAddWord] = useState(false);
  const [selectedText, setSelectedText] = useState("");

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
    >
  ) => {
    if (!userId || !quizQuestions) return;

    // Transform userAnswers to QuizAnswer format
    const answers = Object.values(userAnswers).map((answer) => {
      const question = quizQuestions.find((q) => q.id === answer.question_id);
      const selectedOption = question?.options.find(
        (opt) => opt.id === answer.selectedOptionId
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
      content_id: contentId,
      answers,
      score: score,
      max_score: maxScore,
      percentage: (score / maxScore) * 100,
    });

    setShowQuiz(false);
    setShowTranscript(true);
  };

  return {
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
  };
}
