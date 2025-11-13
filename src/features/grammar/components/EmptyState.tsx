'use client';

/**
 * EmptyState Component
 * 
 * Displays when no categories or topics are available.
 * Shows emoji icon with message and optional description.
 * 
 * @component
 */
export function EmptyState({
  title,
  description,
  emoji = "📚",
}: {
  title: string;
  description: string;
  emoji?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-6">
        <span className="text-5xl">{emoji}</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
        {description}
      </p>
    </div>
  );
}
