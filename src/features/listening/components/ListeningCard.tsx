'use client';

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Lock, Clock } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { Level } from "@/shared/types/common.types";
import { ListeningExercise } from "../types/service.types";

interface ListeningCardProps {
  listening: ListeningExercise;
  level: Level;
  isPremium: boolean;
  onPremiumClick: () => void;
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
}: ListeningCardProps) {
  const isLocked = listening.is_premium && !isPremium;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
        {isLocked && (
          <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow-lg z-10">
            <Lock className="h-5 w-5 text-white" />
          </div>
        )}
        
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {listening.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2 flex-1">
          {listening.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(listening.duration_seconds)}</span>
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