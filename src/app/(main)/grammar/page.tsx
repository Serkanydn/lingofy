"use client";

import Link from "next/link";
import { useActiveGrammarCategories } from "@/features/admin/hooks/useGrammarCategories";
import { cn } from "@/shared/lib/utils";

interface GrammarCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  slug: string;
  order_index: number;
}

function CategoryCard({ category }: { category: GrammarCategory }) {
  return (
    <Link href={`/grammar/${category.slug}`} className="block group">
      <div
        className={cn(
          "relative rounded-3xl p-6 clay-shadow bg-white dark:bg-card",
          "transition-all duration-300 cursor-pointer h-full",
          "hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)]"
        )}
      >
        {/* Icon */}
        <div className="mb-4">
          <span
            className={cn(
              "inline-flex items-center justify-center w-16 h-16 rounded-2xl text-4xl",
              "shadow-[0_4px_14px_rgba(0,0,0,0.1)]",
              "bg-linear-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-800/10"
            )}
          >
            {category.icon}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {category.name}
        </h3>

        {/* Description */}
        {category.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {category.description}
          </p>
        )}

        {/* CTA */}
        <div className="flex items-center text-orange-500 dark:text-orange-400 font-medium text-sm group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors">
          <span>Explore topics</span>
          <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
            →
          </span>
        </div>
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
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-4" />
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded mb-3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}

export default function GrammarPage() {
  const { data: categories, isLoading } = useActiveGrammarCategories();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Grammar Hub
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Master English grammar with our comprehensive lessons.
            </p>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Grammar Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Choose a category to start mastering English grammar.
          </p>
        </div>

        {/* Categories Grid */}
        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-6">
              <span className="text-5xl">📚</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No categories found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
              Grammar categories are being prepared. Check back soon!
            </p>
          </div>
        )}

        {/* Info Banner */}
        <div className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.1)] shrink-0">
              <span className="text-4xl">✨</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Grammar is Free for Everyone!
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                We believe grammar is essential for learning English. That's why
                all grammar topics, explanations, and quizzes are completely
                free. No premium subscription needed!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
