'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlayCircleIcon, Plus, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AudioPlayer } from "@/features/reading/components/AudioPlayer";
import type { ListeningExercise } from "../types/service.types";
import type { AudioAsset } from "@/shared/types/audio.types";

interface ListeningContentCardProps {
  listening: ListeningExercise;
  level: string;
  showTranscript: boolean;
  onToggleTranscript: () => void;
  onQuizClick: () => void;
  onAddWordClick: () => void;
  onTextSelection: () => void;
  hasQuiz: boolean;
}

/**
 * ListeningContentCard Component
 * 
 * Displays the full listening exercise content with audio player,
 * transcript, quiz button, and add word functionality.
 * 
 * @component
 */
export function ListeningContentCard({
  listening,
  level,
  showTranscript,
  onToggleTranscript,
  onQuizClick,
  onAddWordClick,
  onTextSelection,
  hasQuiz,
}: ListeningContentCardProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1 text-sm rounded-full">
          {listening.level}
        </Badge>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          • {formatDuration(listening.duration_seconds)}
        </span>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {listening.title}
      </h1>

      {listening.description && (
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {listening.description}
        </p>
      )}

      {/* Audio Player Section */}
      <div className="mb-8">
        {listening.audio_asset && (
          <AudioPlayer
            audioAsset={{
              id: listening.audio_asset.id,
              storage_url: listening.audio_asset.storage_url,
              cdn_url: listening.audio_asset.cdn_url,
              duration_seconds: listening.audio_asset.duration_seconds,
              format: listening.audio_asset.format,
            } as AudioAsset}
            title={listening.title}
          />
        )}
      </div>

      {/* Tip Card */}
      <div className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-5 mb-6">
        <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
          <span className="text-2xl mr-2">💡</span>
          <strong>Listening Tip:</strong> Listen carefully and try to
          understand the main ideas. You can replay the audio as many times
          as needed. Take the quiz when you're ready to test your
          comprehension!
        </p>
      </div>

      {/* Transcript Section */}
      {listening.transcript && (
        <div className="mb-6">
          <button
            onClick={onToggleTranscript}
            className="w-full flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-orange-500" />
              <span className="font-medium text-gray-900 dark:text-white">
                {showTranscript ? "Hide" : "Show"} Transcript
              </span>
            </div>
            {showTranscript ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {showTranscript && (
            <div className="mt-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
              <div
                className="prose prose-lg max-w-none dark:prose-invert"
                onMouseUp={onTextSelection}
              >
                {listening.transcript.split("\n\n").map((paragraph: string, i: number) => (
                  <p
                    key={i}
                    className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {
        hasQuiz && (
          <div className="flex gap-4">
            <Button
              className="flex-1 rounded-3xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300 py-6 text-lg"
              onClick={onQuizClick}
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
        )
      }

    </div>
  );
}

interface LoadingStateProps { }

/**
 * LoadingState Component
 * 
 * Loading skeleton for listening detail page.
 * 
 * @component
 */
export function LoadingState({ }: LoadingStateProps) {
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
 * Displays when listening exercise is not found.
 * 
 * @component
 */
export function NotFoundState({ level }: NotFoundStateProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-6">
            <span className="text-5xl">🎧</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Listening exercise not found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The listening exercise you're looking for doesn't exist.
          </p>
          <Link href={`/listening/${level}`}>
            <Button className="rounded-2xl bg-orange-500 hover:bg-orange-600 text-white">
              Back to Exercises
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
