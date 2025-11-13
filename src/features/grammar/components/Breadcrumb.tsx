'use client';

import Link from "next/link";
import { cn } from "@/shared/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb Component
 * 
 * Displays navigation breadcrumb trail with clickable links.
 * Last item is always non-clickable (current page).
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
              className={cn(
                "text-sm transition-colors",
                "text-orange-500 hover:text-orange-600",
                "dark:text-orange-400 dark:hover:text-orange-500"
              )}
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <span className="text-sm text-gray-400 mx-2">/</span>
          )}
        </span>
      ))}
    </div>
  );
}
