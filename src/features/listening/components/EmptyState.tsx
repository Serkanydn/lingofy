'use client';

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

/**
 * EmptyState Component
 * 
 * Displays when no listening exercises are found.
 * Shows different messages based on whether filters are applied.
 * 
 * @component
 */
export function EmptyState({ hasFilters, onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-6">
        <span className="text-5xl">🎧</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        No listening exercises found
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
        {hasFilters
          ? "Try adjusting your filters to see more results."
          : "No listening exercises available for this level yet."}
      </p>
      {hasFilters && (
        <Button
          onClick={onClearFilters}
          className="rounded-2xl bg-orange-500 hover:bg-orange-600 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)]"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
}
