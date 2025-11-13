'use client';

import { ReactNode } from 'react';

interface ContentCardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  filters?: ReactNode;
}

export function ContentCard({ children, title, description, filters }: ContentCardProps) {
  return (
    <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden">
      {(title || filters) && (
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            {title && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h2>
                {description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {description}
                  </p>
                )}
              </div>
            )}
            {filters && <div className="flex items-center gap-3">{filters}</div>}
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
