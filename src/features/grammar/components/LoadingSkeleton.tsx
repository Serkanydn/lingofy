'use client';

/**
 * LoadingSkeleton Component
 * 
 * Animated loading skeleton for grid layouts.
 * Displays 6 skeleton cards with pulse animation.
 * 
 * @component
 */
export function LoadingSkeleton() {
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

/**
 * TopicLoadingSkeleton Component
 * 
 * Animated loading skeleton for topic cards.
 * Includes header icon, title, description, and button skeleton.
 * 
 * @component
 */
export function TopicLoadingSkeleton() {
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
