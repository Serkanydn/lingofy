"use client";

import { cn } from "@/shared/lib/utils";
import { Level } from "@/shared/types/common.types";
import { Lock } from "lucide-react";
import Link from "next/link";
import { LEVEL_INFO } from "../constants/levels";
import { useListeningCountByLevel } from "../hooks/useListening";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface LevelCardProps {
  level: Level;
}

export function LevelCard({ level }: LevelCardProps) {
  const { isPremium } = useAuth();

  const { isLoading, data: totalContentCount } = useListeningCountByLevel(level);
  const totalContent = totalContentCount ?? 0;
  const freeContent = Math.min(10, totalContent);

  return (
    <Link href={`/listening/${level}`} className="block group">
      <div
        className={cn(
          "relative rounded-3xl p-6 clay-shadow",
          "transition-all duration-300 cursor-pointer h-full",
          "border-none"
        )}
      >
        {/* Icon */}
        <div className="mb-4">
          <span
            className={cn(
              "inline-flex items-center justify-center w-12 h-12 rounded-2xl text-2xl",
              "shadow-[0_4px_14px_rgba(0,0,0,0.1)]",
              LEVEL_INFO[level].iconBg
            )}
          >
            {LEVEL_INFO[level].icon}
          </span>
        </div>

        {/* Level Badge */}
        <div className="mb-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {level}
          </h3>
          <p
            className={cn(
              "text-base font-semibold mt-1",
              LEVEL_INFO[level].titleColor
            )}
          >
            {LEVEL_INFO[level].name}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          {LEVEL_INFO[level].description}
        </p>

        {/* Stats */}
        {isLoading ? (
          <div className="text-sm text-gray-400">Loading...</div>
        ) : (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              {isPremium
                ? `${totalContent} exercises`
                : `${freeContent} free exercises${totalContent > freeContent ? ` of ${totalContent}` : ""
                }`}
            </span>
            {!isPremium && totalContent > freeContent && (
              <div className="flex items-center gap-1 text-orange-500">
                <Lock className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
