"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Lock, Clock } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ListeningContentWithAudio } from "@/shared/types/model/listening.types";
import { CEFRLevel } from "@/shared/types/enums/cefrLevel.enum";

/**
 * Category color mapping for reading cards
 */
const CATEGORY_COLORS: Record<string, string> = {
  TRAVEL: "text-blue-600 dark:text-blue-400",
  SCIENCE: "text-purple-600 dark:text-purple-400",
  FOOD: "text-orange-600 dark:text-orange-400",
  LIFE: "text-green-600 dark:text-green-400",
  CULTURE: "text-amber-600 dark:text-amber-400",
  NATURE: "text-emerald-600 dark:text-emerald-400",
  EDUCATION: "text-indigo-600 dark:text-indigo-400",
  TECHNOLOGY: "text-cyan-600 dark:text-cyan-400",
};

interface ListeningCardProps {
  listening: ListeningContentWithAudio;
  level: CEFRLevel;
  isPremium: boolean;
  onPremiumClick: () => void;
  score?: number;
}

/**
 * ListeningCard Component
 *
 * Displays a listening exercise card with title, description, duration, and premium status.
 *
 * @component
 */
export function ListeningCard({
  listening,
  level,
  isPremium,
  onPremiumClick,
  score,
}: ListeningCardProps) {
  const isLocked = listening.is_premium && !isPremium;
  const category = listening?.category || "ARTICLE";
  const categoryColor =
    CATEGORY_COLORS[category.toUpperCase()] || "text-gray-600";

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  console.log('score', score);

  const cardContent = (
    <div
      className={cn(
        "relative bg-white dark:bg-card rounded-3xl overflow-hidden",
        "clay-shadow",
        "transition-all duration-300 h-full flex flex-col",
        isLocked ? "opacity-75" : "cursor-pointer"
      )}
    >
      {/* Content */}
      <div className="p-5 flex-1 flex flex-col relative">
        <div className="mb-2 flex items-center justify-between">
          <span
            className={cn(
              "text-xs font-bold uppercase tracking-wide",
              categoryColor
            )}
          >
            {category}
          </span>

          {isLocked && (
            <div className=" w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
              <Lock className="h-5 w-5 text-white" />
            </div>
          )}
          {score !== undefined && !isLocked && score > 0 && (
            <div className=" px-3 py-1 rounded-full bg-orange-500 text-white text-sm font-semibold shadow-lg">
              {Math.round(score)}%
            </div>
          )}
        </div>


        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {listening.title}
        </h3>


        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(listening?.duration_seconds || 0)}</span>
          </div>
          <Badge
            className={cn(
              "text-xs font-medium px-3 py-1 rounded-full",
              listening.is_premium
                ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            )}
          >
            {listening.is_premium ? "Premium" : "Free"}
          </Badge>
        </div>
      </div>
    </div>
  );

  if (isLocked) {
    return <div onClick={onPremiumClick}>{cardContent}</div>;
  }

  return (
    <Link href={`/listening/${level}/${listening.id}`}>{cardContent}</Link>
  );
}
