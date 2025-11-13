'use client';

import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Search } from "lucide-react";

interface EmptyStatesProps {
  type: "loading" | "no-words" | "no-results";
  onAddWord?: () => void;
}

/**
 * EmptyStates Component
 * 
 * Different empty states for:
 * - Loading state with animated skeleton
 * - No words state with add button
 * - No search results state
 * 
 * @component
 */
export function EmptyStates({ type, onAddWord }: EmptyStatesProps) {
  if (type === "loading") {
    return (
      <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-12">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48 mx-auto" />
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (type === "no-results") {
    return (
      <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <Search className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          No words found
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  // no-words state
  return (
    <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-12 text-center">
      <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mx-auto mb-6">
        <BookOpen className="h-12 w-12 text-orange-600 dark:text-orange-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        No words yet
      </h3>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
        Start building your vocabulary by adding words from reading texts or
        manually.
      </p>
      <Button
        onClick={onAddWord}
        className="rounded-3xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300 px-8 py-6 text-base"
      >
        <Plus className="mr-2 h-5 w-5" />
        Add Your First Word
      </Button>
    </div>
  );
}
