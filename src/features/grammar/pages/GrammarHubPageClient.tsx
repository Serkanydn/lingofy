"use client";

import { useActiveGrammarCategories } from "@/features/admin/hooks/useGrammarCategories";
import { CategoryCard } from "../components/CategoryCard";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { EmptyState } from "../components/EmptyState";

/**
 * GrammarHubPageClient Component
 *
 * Main grammar hub page showing all categories.
 * Features:
 * - Category cards grid (3 columns)
 * - Free banner highlighting that grammar is free
 * - Loading skeleton
 * - Empty state when no categories
 *
 * @component
 */
export function GrammarHubPageClient() {
  const { data: categories, isLoading } = useActiveGrammarCategories();

  if (isLoading) {
    return (
      <div className="  py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-8">
            Grammar Hub
          </h1>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="  py-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Grammar Hub
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">
          Master English grammar with comprehensive explanations and practice
          quizzes.
        </p>

        {/* Categories Grid */}
        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <EmptyState
            emoji="📚"
            title="No categories yet"
            description="Grammar categories are being prepared. Check back soon!"
          />
        )}
      </div>
    </div>
  );
}
