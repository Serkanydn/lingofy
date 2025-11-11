"use client";

import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Lock, ChevronDown } from "lucide-react";
import { ReadingContent } from "@/features/reading/types/reading.types";
import { useState, useMemo } from "react";
import { PaywallModal } from "@/features/premium/components/PaywallModal";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  useReadingByLevel,
  useReadingAttempts,
} from "@/features/reading/hooks/useReading";
import { Level } from "@/shared/types/common.types";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Category color mapping
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
  index: number;
  isPremium: boolean;
  onPremiumClick: () => void;
  score?: number;
}

function ReadingCard({
  reading,
  level,
  index,
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
      <div className="relative w-full h-48 bg-linear-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
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
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Category */}
        <div className="mb-2">
          <span
            className={cn(
              "text-xs font-bold uppercase tracking-wide",
              categoryColor
            )}
          >
            {category}
          </span>
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

export default function ReadingLevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level: paramLevel } = use(params);
  const level = paramLevel.toUpperCase() as Level;
  const { data: readings, isLoading } = useReadingByLevel(level);
  const { user, profile, isPremium } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);

  // Filter states
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [accessFilter, setAccessFilter] = useState<"all" | "free" | "premium">(
    "all"
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Fetch user attempts for all reading texts in this level
  const contentIds = readings?.map((r) => r.id) || [];
  const { data: attempts } = useReadingAttempts(contentIds, user?.id);

  // Create a map of content_id to score for quick lookup
  const scoreMap = new Map(
    attempts?.map((attempt) => [attempt.content_id, attempt.percentage]) || []
  );

  // Get unique categories
  const categories = useMemo(() => {
    if (!readings) return [];
    const cats = new Set(readings.map((r) => r.category).filter(Boolean));
    return Array.from(cats);
  }, [readings]);

  // Filter and sort readings
  const filteredReadings = useMemo(() => {
    if (!readings) return [];

    let filtered = [...readings];

    // Apply access filter
    if (accessFilter === "free") {
      filtered = filtered.filter((r) => !r.is_premium);
    } else if (accessFilter === "premium") {
      filtered = filtered.filter((r) => r.is_premium);
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (r) => r.category?.toUpperCase() === categoryFilter.toUpperCase()
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [readings, accessFilter, categoryFilter, sortBy]);

  console.log("readings", readings);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-background py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/reading"
              className="text-md font-medium text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-500 transition-colors"
            >
              Reading Hub
            </Link>
            <span className="text-md font-medium text-gray-400 mx-2">/</span>
            <span className="text-md font-medium text-gray-600 dark:text-gray-400">
              {level}
            </span>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {level} Reading Articles
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
            href="/reading"
            className="text-md font-medium text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-500 transition-colors"
          >
            Reading Hub
          </Link>
          <span className="text-md font-medium text-gray-400 mx-2">/</span>
          <span className="text-md font-medium text-gray-600 dark:text-gray-400">
            {level}
          </span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {level} Reading Articles
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

          {/* Category Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "rounded-2xl bg-white dark:bg-card shadow-[0_4px_14px_rgb(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgb(0,0,0,0.1)] transition-all duration-300 px-5",
                  categoryFilter !== "all" &&
                    "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                )}
              >
                {categoryFilter === "all" ? "All Categories" : categoryFilter}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-2xl max-h-[300px] overflow-y-auto">
              <DropdownMenuItem
                onClick={() => setCategoryFilter("all")}
                className="cursor-pointer"
              >
                All Categories
              </DropdownMenuItem>
              {categories.map((cat) => (
                <DropdownMenuItem
                  key={cat}
                  onClick={() => setCategoryFilter(cat || "all")}
                  className="cursor-pointer capitalize"
                >
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Articles Grid */}
        {filteredReadings && filteredReadings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReadings.map((reading, index) => (
              <ReadingCard
                key={reading.id}
                reading={reading}
                level={level}
                index={index}
                isPremium={isPremium}
                onPremiumClick={() => setShowPaywall(true)}
                score={scoreMap.get(reading.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-6">
              <span className="text-5xl">📚</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
              {accessFilter !== "all" || categoryFilter !== "all"
                ? "Try adjusting your filters to see more results."
                : "No reading articles available for this level yet."}
            </p>
            {(accessFilter !== "all" || categoryFilter !== "all") && (
              <Button
                onClick={() => {
                  setAccessFilter("all");
                  setCategoryFilter("all");
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
