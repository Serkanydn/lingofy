"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, ChevronDown } from "lucide-react";
import { useGrammarCategoryBySlug } from "@/features/admin/hooks/useGrammarCategories";
import { useGrammarByCategory, useGrammarAttempts } from "@/features/grammar/hooks/useGrammar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopicCardProps {
  topic: {
    id: string;
    title: string;
    explanation: string;
  };
  categorySlug: string;
  index: number;
  score?: number;
}

function TopicCard({ topic, categorySlug, index, score }: TopicCardProps) {
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
              <BookOpen className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Topic {index + 1}
            </span>
          </div>
          {score !== undefined && (
            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1 text-sm rounded-full font-semibold">
              {Math.round(score)}%
            </Badge>
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

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] h-full animate-pulse"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-16" />
          </div>
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded mb-3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-4" />
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        </div>
      ))}
    </div>
  );
}

export default function GrammarCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = React.use(params);

  const { data: categoryInfo, isLoading: categoryLoading } = useGrammarCategoryBySlug(categorySlug);
  const { data: topics, isLoading: topicsLoading } = useGrammarByCategory(categoryInfo?.id || "");
  const { user } = useAuth();
  const [sortBy, setSortBy] = React.useState<"newest" | "oldest">("newest");

  // Fetch user attempts for all topics in this category
  const contentIds = topics?.map((t) => t.id) || [];
  const { data: attempts } = useGrammarAttempts(contentIds, user?.id);

  // Create a map of content_id to score for quick lookup
  const scoreMap = new Map(
    attempts?.map((attempt) => [attempt.content_id, attempt.percentage]) || []
  );

  // Sort topics
  const sortedTopics = React.useMemo(() => {
    if (!topics) return [];
    const sorted = [...topics];
    sorted.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });
    return sorted;
  }, [topics, sortBy]);

  if (categoryLoading || topicsLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link
              href="/grammar"
              className="text-sm text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-500 transition-colors"
            >
              Grammar Hub
            </Link>
            <span className="text-sm text-gray-400 mx-2">/</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Loading...
            </span>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-white dark:bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-6">
              <span className="text-5xl">📚</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Category not found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The grammar category you're looking for doesn't exist.
            </p>
            <Link href="/grammar">
              <Button className="rounded-2xl bg-orange-500 hover:bg-orange-600 text-white">
                Back to Grammar Hub
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/grammar"
            className="text-sm text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-500 transition-colors"
          >
            Grammar Hub
          </Link>
          <span className="text-sm text-gray-400 mx-2">/</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {categoryInfo.name}
          </span>
        </div>

        {/* Category Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.1)]">
              <span className="text-4xl">{categoryInfo.icon}</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                {categoryInfo.name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {sortedTopics.length} {sortedTopics.length === 1 ? 'topic' : 'topics'} available
              </p>
            </div>
          </div>
          {categoryInfo.description && (
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {categoryInfo.description}
            </p>
          )}
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
        </div>

        {/* Topics Grid */}
        {sortedTopics && sortedTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTopics.map((topic, index) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                categorySlug={categorySlug}
                index={index}
                score={scoreMap.get(topic.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-6">
              <span className="text-5xl">📝</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No topics found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
              Topics for this category are being prepared. Check back soon!
            </p>
            <Link href="/grammar">
              <Button className="rounded-2xl bg-orange-500 hover:bg-orange-600 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)]">
                Back to Categories
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
