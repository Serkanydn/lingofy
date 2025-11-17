"use client";

import { use, useState, useMemo } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useListeningByLevel } from "../hooks/useListening";
import { PaywallModal } from "@/features/premium/components/PaywallModal";
import { ListeningCard } from "../components/ListeningCard";
import { FilterBar } from "../components/FilterBar";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { EmptyState } from "../components/EmptyState";
import { Breadcrumb } from "../components/Breadcrumb";
import { useQuizLimit } from "@/features/statistics/hooks/useQuizLimit";
import { QuizLimitWarning } from "@/features/statistics/components/QuizLimitWarning";
import type { Level } from "@/shared/types/common.types";
import { useReadingAttempts } from "@/features/reading/hooks";

interface ListeningLevelPageClientProps {
  params: Promise<{ level: string }>;
}

/**
 * ListeningLevelPageClient Component
 *
 * Main client component for displaying listening exercises by level.
 * Handles filtering, sorting, and premium access control.
 *
 * @component
 */
export function ListeningLevelPageClient({
  params,
}: ListeningLevelPageClientProps) {
  const { level: paramLevel } = use(params);
  const level = paramLevel.toUpperCase() as Level;
  const { data: listeningContent, isLoading } = useListeningByLevel(level);
  const { user, isPremium } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);

  const {
    canTake,
    remaining,
    used,
    isPremium: isPremiumFromLimit,
    maxQuizzes,
  } = useQuizLimit();

  // Filter states
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [accessFilter, setAccessFilter] = useState<"all" | "free" | "premium">(
    "all"
  );

  const { data: attempts } = useReadingAttempts(
    listeningContent?.map((l) => l.id) || [],
    user?.id
  );

  // Create a map of content_id to score for quick lookup
  const scoreMap = new Map(
    attempts?.map((attempt) => [attempt.content_id, attempt.percentage]) || []
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

  const handleClearFilters = () => {
    setAccessFilter("all");
  };

  const hasFilters = accessFilter !== "all";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-background py-8">
        <div className="container mx-auto px-4">
          <Breadcrumb
            items={[
              { label: "Listening Hub", href: "/listening" },
              { label: level },
            ]}
          />

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
        <Breadcrumb
          items={[
            { label: "Listening Hub", href: "/listening" },
            { label: level },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {level} Listening Exercises
          </h1>
        </div>

        {/* Quiz Limit Warning */}
        {!isPremiumFromLimit && (
          <div className="mb-6">
            <QuizLimitWarning
              remaining={remaining}
              used={used}
              maxQuizzes={maxQuizzes}
            />
          </div>
        )}

        <FilterBar
          sortBy={sortBy}
          setSortBy={setSortBy}
          accessFilter={accessFilter}
          setAccessFilter={setAccessFilter}
        />

        {filteredContent && filteredContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((listening) => (
              <ListeningCard
                key={listening.id}
                listening={listening}
                level={level}
                isPremium={isPremium}
                onPremiumClick={() => setShowPaywall(true)}
                score={scoreMap.get(listening.id)}
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
