"use client";

import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, Lock, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";
import { PaywallModal } from "@/features/premium/components/PaywallModal";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Level } from "@/shared/types/common.types";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useListeningByLevel,
} from "@/features/listening/hooks/useListening";
import { ListeningExercise } from "@/features/listening/types/service.types";

// Category color mapping
const CATEGORY_COLORS: Record<string, string> = {
  CONVERSATION: "text-blue-600 dark:text-blue-400",
  PODCAST: "text-purple-600 dark:text-purple-400",
  INTERVIEW: "text-orange-600 dark:text-orange-400",
  STORY: "text-green-600 dark:text-green-400",
  NEWS: "text-red-600 dark:text-red-400",
  LECTURE: "text-indigo-600 dark:text-indigo-400",
  DIALOGUE: "text-cyan-600 dark:text-cyan-400",
};

interface ListeningCardProps {
  listening: ListeningExercise;
  level: Level;
  index: number;
  isPremium: boolean;
  onPremiumClick: () => void;
}

function ListeningCard({
  listening,
  level,
  index,
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

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-card rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] h-full animate-pulse"
        >
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-800" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20" />
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ListeningLevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level: paramLevel } = use(params);
  const level = paramLevel.toUpperCase() as Level;
  const { isPremium } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);

  // Fetch real data from API
  const { data: listeningContent, isLoading } = useListeningByLevel(level);

  // Filter states
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [accessFilter, setAccessFilter] = useState<"all" | "free" | "premium">(
    "all"
  );

  // Filter and sort content
  const filteredContent = useMemo(() => {
    if (!listeningContent) return [];
    let filtered = [...listeningContent];

    // Apply access filter
    if (accessFilter === "free") {
      filtered = filtered.filter((l) => !l.is_premium);
    } else if (accessFilter === "premium") {
      filtered = filtered.filter((l) => l.is_premium);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at || "").getTime();
      const dateB = new Date(b.created_at || "").getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [listeningContent, accessFilter, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link
              href="/listening"
              className="text-md font-medium text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-500 transition-colors"
            >
              Listening Hub
            </Link>
            <span className="text-md font-medium text-gray-400 mx-2">/</span>
            <span className="text-md font-medium text-gray-600 dark:text-gray-400">
              {level}
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {level} Listening Exercises
            </h1>
          </div>

          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/listening"
            className="text-md font-medium text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-500 transition-colors"
          >
            Listening Hub
          </Link>
          <span className="text-md font-medium text-gray-400 mx-2">/</span>
          <span className="text-md font-medium text-gray-600 dark:text-gray-400">
            {level}
          </span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {level} Listening Exercises
          </h1>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="rounded-2xl bg-white dark:bg-card shadow-[0_4px_14px_rgb(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgb(0,0,0,0.1)] transition-all duration-300 px-5"
              >
                Sort: {sortBy === "newest" ? "Newest" : "Oldest"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-2xl">
              <DropdownMenuItem
                onClick={() => setSortBy("newest")}
                className="cursor-pointer"
              >
                Newest
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy("oldest")}
                className="cursor-pointer"
              >
                Oldest
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Access Type Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "rounded-2xl bg-white dark:bg-card shadow-[0_4px_14px_rgb(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgb(0,0,0,0.1)] transition-all duration-300 px-5",
                  accessFilter !== "all" &&
                    "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                )}
              >
                {accessFilter === "all"
                  ? "All Access"
                  : accessFilter === "free"
                  ? "Free"
                  : "Premium"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-2xl">
              <DropdownMenuItem
                onClick={() => setAccessFilter("all")}
                className="cursor-pointer"
              >
                All Access
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setAccessFilter("free")}
                className="cursor-pointer"
              >
                Free
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setAccessFilter("premium")}
                className="cursor-pointer"
              >
                Premium
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Listening Content Grid */}
        {filteredContent && filteredContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((listening, index) => (
              <ListeningCard
                key={listening.id}
                listening={listening}
                level={level}
                index={index}
                isPremium={isPremium}
                onPremiumClick={() => setShowPaywall(true)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-6">
              <span className="text-5xl">🎧</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No listening exercises found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
              {accessFilter !== "all"
                ? "Try adjusting your filters to see more results."
                : "No listening exercises available for this level yet."}
            </p>
            {accessFilter !== "all" && (
              <Button
                onClick={() => {
                  setAccessFilter("all");
                }}
                className="rounded-2xl bg-orange-500 hover:bg-orange-600 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)]"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        <PaywallModal
          open={showPaywall}
          onClose={() => setShowPaywall(false)}
        />
      </div>
    </div>
  );
}
