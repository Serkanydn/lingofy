'use client';

import { Badge } from "@/components/ui/badge";
import { BookOpen, Lightbulb, FileText } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ContentSection {
  title: string;
  icon: typeof BookOpen;
  content: string | string[];
  bgColor: string;
  iconColor: string;
  onTextSelect?: () => void;
}

interface ContentSectionProps {
  section: ContentSection;
}

/**
 * ContentSection Component
 * 
 * Displays a content section with icon, title, and content.
 * Supports single text or array of examples.
 * Handles text selection for word addition.
 * 
 * @component
 */
export function ContentSection({ section }: ContentSectionProps) {
  const Icon = section.icon;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.1)]",
            section.iconColor
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {section.title}
        </h2>
      </div>

      {Array.isArray(section.content) ? (
        <div className="space-y-3">
          {section.content.map((example, index) => (
            <div
              key={index}
              className={cn(
                "border-l-4 rounded-r-2xl p-5",
                section.bgColor
              )}
            >
              <div className="flex items-start gap-3">
                <span className="font-bold text-lg shrink-0 text-amber-600 dark:text-amber-400">
                  {index + 1}.
                </span>
                <p
                  className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                  onMouseUp={section.onTextSelect}
                >
                  {example}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={cn("border-2 rounded-2xl p-6", section.bgColor)}>
          <p
            className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap"
            onMouseUp={section.onTextSelect}
          >
            {section.content}
          </p>
        </div>
      )}
    </div>
  );
}

interface TopicHeaderProps {
  title: string;
}

/**
 * TopicHeader Component
 * 
 * Displays topic title with FREE and GRAMMAR badges.
 * 
 * @component
 */
export function TopicHeader({ title }: TopicHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 text-sm rounded-full">
          FREE
        </Badge>
        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1 text-sm rounded-full">
          GRAMMAR
        </Badge>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        {title}
      </h1>
    </>
  );
}

interface CategoryHeaderProps {
  icon: string;
  name: string;
  description: string | null;
  topicCount: number;
}

/**
 * CategoryHeader Component
 * 
 * Displays category icon, name, description, and topic count.
 * 
 * @component
 */
export function CategoryHeader({
  icon,
  name,
  description,
  topicCount,
}: CategoryHeaderProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.1)]">
          <span className="text-4xl">{icon}</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {topicCount} {topicCount === 1 ? "topic" : "topics"} available
          </p>
        </div>
      </div>
      {description && (
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
