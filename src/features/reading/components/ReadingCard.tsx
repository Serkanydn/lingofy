"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { ReadingContent } from "../../../shared/types/model/reading.types";
import type { Level } from "@/shared/types/model/common.types";

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

interface ReadingCardProps {
  reading: ReadingContent;
  level: Level;
  isPremium: boolean;
  onPremiumClick: () => void;
  score?: number;
}

/**
 * ReadingCard Component
 *
 * Displays a reading article card with image, title, category, and premium status.
 * Shows user's score if they've attempted the quiz.
 *
 * @component
 */
export function ReadingCard({
  reading,
  level,
  isPremium,
  onPremiumClick,
  score,
}: ReadingCardProps) {
  const isLocked = reading.is_premium && !isPremium;
  const category = reading.category || "ARTICLE";
  const categoryColor =
    CATEGORY_COLORS[category.toUpperCase()] || "text-gray-600";

  const cardContent = (
    <div
      className={cn(
        "relative bg-white dark:bg-card rounded-3xl overflow-hidden",
        "clay-shadow",
        "transition-all duration-300 h-full flex flex-col",
        isLocked ? "opacity-75" : "cursor-pointer"
      )}
    >
      {/* Image */}
      {/* <div className="relative w-full h-48 bg-linear-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
        {reading.image_url ? (
          <img
            src={reading.image_url}
            alt={reading.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {category === "TRAVEL" && "🗼"}
            {category === "SCIENCE" && "🚀"}
            {category === "FOOD" && "🍰"}
            {category === "LIFE" && "📚"}
            {category === "CULTURE" && "🏛️"}
            {category === "NATURE" && "🐝"}
            {category === "EDUCATION" && "📖"}
            {category === "TECHNOLOGY" && "💻"}
            {!category && "📄"}
          </div>
        )}
        {isLocked && (
          <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
            <Lock className="h-5 w-5 text-white" />
          </div>
        )}
        {score !== undefined && !isLocked && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-orange-500 text-white text-sm font-semibold shadow-lg">
            {Math.round(score)}%
          </div>
        )}
      </div> */}

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Category */}
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
          {reading.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-3 flex-1">
          {reading.content.substring(0, 120)}...
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <Badge
            className={cn(
              "text-xs font-medium px-3 py-1 rounded-full",
              reading.is_premium
                ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            )}
          >
            {reading.is_premium ? "Premium" : "Free"}
          </Badge>
        </div>
      </div>
    </div>
  );

  if (isLocked) {
    return <div onClick={onPremiumClick}>{cardContent}</div>;
  }

  return <Link href={`/reading/${level}/${reading.id}`}>{cardContent}</Link>;
}
