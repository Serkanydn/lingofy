'use client';

import { Button } from "@/components/ui/button";
import { Edit2, Trash2, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserWord, WordCategory } from "../hooks/useWords";

interface WordRowProps {
  word: UserWord;
  categories: WordCategory[] | undefined;
  onEdit: (word: UserWord) => void;
  onDelete: (word: UserWord) => void;
  onCategoryChange: (wordId: string, categoryId: string | null) => void;
}

/**
 * WordRow Component
 * 
 * Displays a single word in table format with:
 * - Word and description column
 * - Example sentences column
 * - Category dropdown selector
 * - Edit and delete action buttons
 * 
 * @component
 */
export function WordRow({
  word,
  categories,
  onEdit,
  onDelete,
  onCategoryChange,
}: WordRowProps) {
  const category = categories?.find((c) => c.id === word.category_id);

  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 rounded-4xl clay-shadow">
      <div className="col-span-3 flex flex-col justify-center">
        <p className="text-base font-bold text-gray-900 dark:text-white mb-1">
          {word.word}
        </p>
        {word.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {word.description}
          </p>
        )}
      </div>
      <div className="col-span-4 flex flex-col justify-center">
        {word.example_sentences?.[0] && (
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2">
            {word.example_sentences[0]}
          </p>
        )}
        {word.example_sentences && word.example_sentences.length > 1 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic line-clamp-2">
            "{word.example_sentences.slice(1).join('", "')}"
          </p>
        )}
      </div>
      <div className="col-span-3 flex items-center justify-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="rounded-2xl h-9 border-2 justify-start"
            >
              {category ? (
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-xs">{category.name}</span>
                  <ChevronDown className="ml-auto h-3 w-3 opacity-50" />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs">Uncategorized</span>
                  <ChevronDown className="ml-auto h-3 w-3 opacity-50" />
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-2xl w-56" align="start">
            <DropdownMenuItem onClick={() => onCategoryChange(word.id, null)}>
              <span className="text-sm">Uncategorized</span>
            </DropdownMenuItem>
            {categories?.map((cat) => (
              <DropdownMenuItem
                key={cat.id}
                onClick={() => onCategoryChange(word.id, cat.id)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm">{cat.name}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="col-span-2 flex items-center justify-end gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onEdit(word)}
          className="rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 h-8 w-8 p-0"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(word)}
          className="rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
