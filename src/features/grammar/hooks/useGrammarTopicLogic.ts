'use client';

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useQuizSubmit } from "@/features/quiz/hooks/useQuizSubmit";
import { useGrammarDetail } from "@/features/grammar/hooks/useGrammar";
import { useQuizFromId } from "@/features/quiz/hooks/useQuiz";

/**
 * useGrammarTopicLogic Hook
 * 
 * Manages topic detail page business logic:
 * - Fetches topic details and quiz questions
 * - Handles quiz flow (show/hide)
 * - Handles text selection for word addition
 * - Submits quiz results
 * 
 * @param topicId - ID of the grammar topic
 * @returns Topic data, quiz state, handlers, and loading states
 */
export function useGrammarTopicLogic(topicId: string) {
  const { user } = useAuth();
  const { data: topic, isLoading } = useGrammarDetail(topicId);
  const { data: quizQuestions } = useQuizFromId(topic?.id || "");
  const submitQuiz = useQuizSubmit();

  const [showQuiz, setShowQuiz] = useState(false);
  const [showAddWord, setShowAddWord] = useState(false);
  const [selectedText, setSelectedText] = useState("");

  /**
   * Handles text selection for adding words
   */
  const handleTextSelection = () => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      setSelectedText(selection);
      setShowAddWord(true);
    }
  };

  /**
   * Handles quiz completion and submits results
   */
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
    if (!user || !quizQuestions || !topic) return;

    // Transform userAnswers to QuizAnswer format
    const answers = Object.values(userAnswers).map((answer) => {
      const question = quizQuestions.find((q) => q.id === answer.question_id);
      const selectedOption = question?.options.find(
        (opt: { id: string; is_correct: boolean }) =>
          opt.id === answer.selectedOptionId
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
      content_id: topic.id,
      answers,
      score: score,
      max_score: maxScore,
      percentage: (score / maxScore) * 100,
    });
  };

  /**
   * Starts the quiz
   */
  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  /**
   * Exits the quiz
   */
  const handleExitQuiz = () => {
    setShowQuiz(false);
  };

  /**
   * Opens add word dialog without selected text
   */
  const handleAddWord = () => {
    setSelectedText("");
    setShowAddWord(true);
  };

  /**
   * Closes add word dialog
   */
  const handleCloseAddWord = () => {
    setShowAddWord(false);
  };

  return {
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
  };
}
