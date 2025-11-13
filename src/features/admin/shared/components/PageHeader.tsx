'use client';

import { ReactNode } from 'react';

interface PageHeaderProps {
  icon: ReactNode;
  iconBgClass: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function PageHeader({
  icon,
  iconBgClass,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-10">
      <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl ${iconBgClass} flex items-center justify-center shadow-[0_4px_14px_rgba(168,85,247,0.4)]`}>
              {icon}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      </div>
    </div>
  );
}
