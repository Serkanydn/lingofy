"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlayCircleIcon, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AudioPlayer } from "../components/AudioPlayer";
import { Breadcrumb } from "../components/Breadcrumb";
import type { ReadingContent } from "../types/reading.types";
import type { AudioAsset } from "@/shared/types/audio.types";

interface ReadingContentCardProps {
  reading: ReadingContent;
  level: string;
  onQuizClick: () => void;
  onAddWordClick: () => void;
  onTextSelection: () => void;
  hasQuiz: boolean;
}

/**
 * ReadingContentCard Component
 *
 * Displays the full reading article content with audio player,
 * quiz button, and add word functionality.
 *
 * @component
 */
export function ReadingContentCard({
  reading,
  level,
  onQuizClick,
  onAddWordClick,
  onTextSelection,
  hasQuiz,
}: ReadingContentCardProps) {
  const audioAsset: AudioAsset | undefined = undefined;

  return (
    <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden grid gap-6 p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1 text-sm">
          {reading.level} 
        </Badge>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {reading.title}
      </h1>

      {/* Audio Player Section */}
      {audioAsset && <AudioPlayer audioAsset={audioAsset} />}

      {/* Content Section */}
      <div
        className="prose prose-lg max-w-none dark:prose-invert"
        onMouseUp={onTextSelection}
      >
        {reading.content.split("\n\n").map((paragraph, i) => (
          <p
            key={i}
            className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          className="flex-1 rounded-3xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300 py-6 text-lg"
          onClick={onQuizClick}
          disabled={!hasQuiz}
        >
          <PlayCircleIcon className="mr-2 h-6 w-6" />
          Take the Quiz
        </Button>
        <Button
          variant="outline"
          className="rounded-3xl px-6 py-6 border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300"
          onClick={onAddWordClick}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

interface LoadingStateProps {}

/**
 * LoadingState Component
 *
 * Loading skeleton for reading detail page.
 *
 * @component
 */
export function LoadingState({}: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-48" />
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64" />
          <div className="bg-white dark:bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface NotFoundStateProps {
  level: string;
}

/**
 * NotFoundState Component
 *
 * Displays when reading article is not found.
 *
 * @component
 */
export function NotFoundState({ level }: NotFoundStateProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-6">
            <span className="text-5xl">📖</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Article not found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The reading article you're looking for doesn't exist.
          </p>
          <Link href={`/reading/${level}`}>
            <Button className="rounded-2xl bg-orange-500 hover:bg-orange-600 text-white">
              Back to Articles
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
