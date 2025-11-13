'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGrammarCategoryLogic } from "../hooks/useGrammarCategoryLogic";
import { Breadcrumb } from "../components/Breadcrumb";
import { CategoryHeader } from "../components/Headers";
import { SortDropdown } from "../components/SortDropdown";
import { TopicCard } from "../components/TopicCard";
import { TopicLoadingSkeleton } from "../components/LoadingSkeleton";
import { EmptyState } from "../components/EmptyState";

interface GrammarCategoryPageClientProps {
  categorySlug: string;
}

/**
 * GrammarCategoryPageClient Component
 * 
 * Category page showing all topics within a grammar category.
 * Features:
 * - Breadcrumb navigation
 * - Category header with icon, name, description
 * - Sort dropdown (newest/oldest)
 * - Topic cards grid with scores
 * - Loading skeleton
 * - Empty state when no topics
 * 
 * @component
 */
export function GrammarCategoryPageClient({
  categorySlug,
}: GrammarCategoryPageClientProps) {
  const {
    categoryInfo,
    topics,
    scoreMap,
    sortBy,
    setSortBy,
    isLoading,
  } = useGrammarCategoryLogic(categorySlug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-background py-12">
        <div className="container mx-auto px-4">
          <Breadcrumb
            items={[
              { label: "Grammar Hub", href: "/grammar" },
              { label: "Loading..." },
            ]}
          />
          <TopicLoadingSkeleton />
        </div>
      </div>
    );
  }

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-white dark:bg-background py-12">
        <div className="container mx-auto px-4">
          <EmptyState
            emoji="📚"
            title="Category not found"
            description="The grammar category you're looking for doesn't exist."
          />
          <div className="flex justify-center mt-6">
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
        <Breadcrumb
          items={[
            { label: "Grammar Hub", href: "/grammar" },
            { label: categoryInfo.name },
          ]}
        />

        {/* Category Header */}
        <CategoryHeader
          icon={categoryInfo.icon}
          name={categoryInfo.name}
          description={categoryInfo.description}
          topicCount={topics.length}
        />

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        {/* Topics Grid */}
        {topics && topics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, index) => (
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
          <>
            <EmptyState
              emoji="📝"
              title="No topics found"
              description="Topics for this category are being prepared. Check back soon!"
            />
            <div className="flex justify-center mt-6">
              <Link href="/grammar">
                <Button className="rounded-2xl bg-orange-500 hover:bg-orange-600 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)]">
                  Back to Categories
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
