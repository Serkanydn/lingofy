'use client';

import Link from "next/link";

interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
}

/**
 * Breadcrumb Component
 * 
 * Navigation breadcrumb for listening pages.
 * Supports multiple levels with optional links.
 * 
 * @component
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="mb-6">
      {items.map((item, index) => (
        <span key={index}>
          {item.href ? (
            <Link
              href={item.href}
              className="text-md font-medium text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-500 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-md font-medium text-gray-600 dark:text-gray-400">
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <span className="text-md font-medium text-gray-400 mx-2">/</span>
          )}
        </span>
      ))}
    </div>
  );
}
