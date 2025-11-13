'use client';

/**
 * LoadingSkeleton Component
 * 
 * Displays a loading skeleton for listening exercise cards while data is being fetched.
 * Shows 6 skeleton cards in a grid layout.
 * 
 * @component
 */
export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-card rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] h-full animate-pulse"
        >
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-800" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20" />
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
