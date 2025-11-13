'use client';

import { use, useState, useMemo } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useReadingByLevel, useReadingAttempts } from "../hooks/useReading";
import { PaywallModal } from "@/features/premium/components/PaywallModal";
import { ReadingCard } from "../components/ReadingCard";
import { FilterBar } from "../components/FilterBar";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { EmptyState } from "../components/EmptyState";
import { Breadcrumb } from "../components/Breadcrumb";
import type { Level } from "@/shared/types/common.types";

interface ReadingLevelPageClientProps {
  params: Promise<{ level: string }>;
}

/**
 * ReadingLevelPageClient Component
 * 
 * Main client component for displaying reading articles by level.
 * Handles filtering, sorting, and user score display.
 * 
 * @component
 */
export function ReadingLevelPageClient({ params }: ReadingLevelPageClientProps) {
  const { level: paramLevel } = use(params);
  const level = paramLevel.toUpperCase() as Level;
  const { data: readings, isLoading } = useReadingByLevel(level);
  const { user, isPremium } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);

  // Filter states
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [accessFilter, setAccessFilter] = useState<"all" | "free" | "premium">("all");
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
    const cats = new Set(readings.map((r) => r.category).filter((c): c is string => !!c));
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

  const handleClearFilters = () => {
    setAccessFilter("all");
    setCategoryFilter("all");
  };

  const hasFilters = accessFilter !== "all" || categoryFilter !== "all";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-background py-8">
        <div className="container mx-auto px-4">
          <Breadcrumb
            items={[
              { label: "Reading Hub", href: "/reading" },
              { label: level },
            ]}
          />

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
        <Breadcrumb
          items={[
            { label: "Reading Hub", href: "/reading" },
            { label: level },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {level} Reading Articles
          </h1>
        </div>

        <FilterBar
          sortBy={sortBy}
          setSortBy={setSortBy}
          accessFilter={accessFilter}
          setAccessFilter={setAccessFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={categories}
        />

        {filteredReadings && filteredReadings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReadings.map((reading) => (
              <ReadingCard
                key={reading.id}
                reading={reading}
                level={level}
                isPremium={isPremium}
                onPremiumClick={() => setShowPaywall(true)}
                score={scoreMap.get(reading.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            hasFilters={hasFilters}
            onClearFilters={handleClearFilters}
          />
        )}

        <PaywallModal
          open={showPaywall}
          onClose={() => setShowPaywall(false)}
        />
      </div>
    </div>
  );
}
