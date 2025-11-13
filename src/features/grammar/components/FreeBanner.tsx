'use client';

/**
 * FreeBanner Component
 * 
 * Displays prominent banner highlighting that grammar is free.
 * Shows sparkle emoji with title and description.
 * 
 * @component
 */
export function FreeBanner() {
  return (
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
  );
}
