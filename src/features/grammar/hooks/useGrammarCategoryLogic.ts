'use client';

import { useState, useMemo } from "react";
import { useGrammarCategoryBySlug } from "@/features/admin/hooks/useGrammarCategories";
import { useGrammarByCategory, useGrammarAttempts } from "@/features/grammar/hooks/useGrammar";
import { useAuth } from "@/features/auth/hooks/useAuth";

type SortOption = "newest" | "oldest";

interface GrammarTopic {
  id: string;
  title: string;
  explanation: string;
  created_at?: string;
}

/**
 * useGrammarCategoryLogic Hook
 * 
 * Manages category page business logic:
 * - Fetches category info and topics
 * - Fetches user attempts and scores
 * - Handles sorting (newest/oldest)
 * - Creates score map for quick lookup
 * 
 * @param categorySlug - URL slug for the category
 * @returns Category data, topics, scores, loading states, and sort handlers
 */
export function useGrammarCategoryLogic(categorySlug: string) {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Fetch category info
  const {
    data: categoryInfo,
    isLoading: categoryLoading,
  } = useGrammarCategoryBySlug(categorySlug);

  // Fetch topics for this category
  const {
    data: topics,
    isLoading: topicsLoading,
  } = useGrammarByCategory(categoryInfo?.id || "");

  // Fetch user attempts for all topics in this category
  const contentIds = topics?.map((t) => t.id) || [];
  const { data: attempts } = useGrammarAttempts(contentIds, user?.id);

  // Create a map of content_id to score for quick lookup
  const scoreMap = useMemo(
    () =>
      new Map(
        attempts?.map((attempt) => [attempt.content_id, attempt.percentage]) || []
      ),
    [attempts]
  );

  // Sort topics by date
  const sortedTopics = useMemo(() => {
    if (!topics) return [];
    const sorted = [...topics];
    sorted.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });
    return sorted;
  }, [topics, sortBy]);

  return {
    categoryInfo,
    topics: sortedTopics,
    scoreMap,
    sortBy,
    setSortBy,
    isLoading: categoryLoading || topicsLoading,
  };
}
