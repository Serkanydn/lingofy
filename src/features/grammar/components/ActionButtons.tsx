'use client';

import { Button } from "@/components/ui/button";
import { PlayCircleIcon, Plus } from "lucide-react";

interface ActionButtonsProps {
  hasQuiz: boolean;
  onStartQuiz: () => void;
  onAddWord: () => void;
}

/**
 * ActionButtons Component
 * 
 * Displays quiz button and add word button.
 * Quiz button is prominent, add word is icon-only outline button.
 * 
 * @component
 */
export function ActionButtons({
  hasQuiz,
  onStartQuiz,
  onAddWord,
}: ActionButtonsProps) {
  if (!hasQuiz) return null;

  return (
    <div className="flex gap-4">
      <Button
        className="flex-1 rounded-3xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300 py-6 text-lg"
        onClick={onStartQuiz}
      >
        <PlayCircleIcon className="mr-2 h-6 w-6" />
        Take the Quiz
      </Button>
      <Button
        variant="outline"
        className="rounded-3xl px-6 py-6 border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300"
        onClick={onAddWord}
      >
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
}
