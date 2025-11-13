'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface GrammarTopic {
  id: string;
  title: string;
  explanation: string;
}

interface TopicCardProps {
  topic: GrammarTopic;
  categorySlug: string;
  index: number;
  score?: number;
}

/**
 * TopicCard Component
 * 
 * Displays a grammar topic card with:
 * - Topic number badge
 * - Score badge (if available)
 * - Title and explanation preview
 * - Learn Now button
 * 
 * @component
 */
export function TopicCard({ topic, categorySlug, index, score }: TopicCardProps) {
  return (
    <Link href={`/grammar/${categorySlug}/${topic.id}`} className="block group">
      <div
        className={cn(
          "relative rounded-3xl p-6 clay-shadow bg-white dark:bg-card",
          "transition-all duration-300 cursor-pointer h-full",
          "hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)]"
        )}
      >
        {/* Header with Icon and Score */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.1)]">
              <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                #{index + 1}
              </span>
            </div>
          </div>
          {score !== undefined && (
            <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold">
              {score}%
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
          {topic.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-3">
          {topic.explanation}
        </p>

        {/* CTA Button */}
        <Button className="w-full rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300">
          Learn Now
        </Button>
      </div>
    </Link>
  );
}
