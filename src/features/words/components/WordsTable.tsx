'use client';

import { WordRow } from "./WordRow";
import type { UserWord, WordCategory } from "../hooks/useWords";

interface WordsTableProps {
  words: UserWord[];
  categories: WordCategory[] | undefined;
  onEdit: (word: UserWord) => void;
  onDelete: (word: UserWord) => void;
  onCategoryChange: (wordId: string, categoryId: string | null) => void;
}

/**
 * WordsTable Component
 * 
 * Table display with:
 * - Header row with column labels
 * - Scrollable body (max 600px height)
 * - Word rows with data
 * 
 * @component
 */
export function WordsTable({
  words,
  categories,
  onEdit,
  onDelete,
  onCategoryChange,
}: WordsTableProps) {
  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="col-span-3 text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400">
          Word
        </div>
        <div className="col-span-4 text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400">
          Example Sentences
        </div>
        <div className="col-span-3 text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400">
          Category
        </div>
        <div className="col-span-2 text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 text-right">
          Actions
        </div>
      </div>

      {/* Table Body with Scroll */}
      <div className="max-h-[600px] overflow-y-auto">
        <div className="grid gap-3 p-3">
          {words.map((word) => (
            <WordRow
              key={word.id}
              word={word}
              categories={categories}
              onEdit={onEdit}
              onDelete={onDelete}
              onCategoryChange={onCategoryChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
