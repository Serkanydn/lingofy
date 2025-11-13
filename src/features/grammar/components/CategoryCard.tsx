'use client';

import Link from "next/link";
import { cn } from "@/shared/lib/utils";

export interface GrammarCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  slug: string;
  order_index: number;
}

interface CategoryCardProps {
  category: GrammarCategory;
}

/**
 * CategoryCard Component
 * 
 * Displays a grammar category card with:
 * - Icon with gradient background
 * - Category name and description
 * - Explore topics CTA with arrow animation
 * 
 * @component
 */
export function CategoryCard({ category }: CategoryCardProps) {
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
