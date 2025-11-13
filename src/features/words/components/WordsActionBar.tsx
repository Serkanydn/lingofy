'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Play, Download, Folder, ChevronDown } from "lucide-react";
import type { WordCategory } from "../hooks/useWords";

interface WordsActionBarProps {
  onStartFlashcards: () => void;
  isFlashcardsDisabled: boolean;
  sortBy: "a-z" | "z-a" | "newest" | "oldest";
  onSortChange: (sort: "a-z" | "z-a" | "newest" | "oldest") => void;
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  categories: WordCategory[] | undefined;
  wordsInCategory: (categoryId: string | null) => number;
}

/**
 * WordsActionBar Component
 * 
 * Action toolbar with:
 * - Start flashcard practice button
 * - Export collection button
 * - Category filter dropdown
 * - Sort dropdown (A-Z, Z-A, Newest, Oldest)
 * 
 * @component
 */
export function WordsActionBar({
  onStartFlashcards,
  isFlashcardsDisabled,
  sortBy,
  onSortChange,
  selectedCategory,
  onCategorySelect,
  categories,
  wordsInCategory,
}: WordsActionBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        onClick={onStartFlashcards}
        disabled={isFlashcardsDisabled}
        className="rounded-3xl bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/30 shadow-[0_4px_14px_rgba(249,115,22,0.2)] transition-all duration-300"
      >
        <Play className="mr-2 h-4 w-4" />
        Start Flashcard Practice
      </Button>
      <Button
        variant="outline"
        className="rounded-3xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300"
      >
        <Download className="mr-2 h-4 w-4" />
        Export Collection
      </Button>

      <div className="ml-auto flex gap-3">
        {/* Category Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="rounded-3xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 px-6 h-12 text-sm transition-all duration-300"
            >
              <Folder className="mr-2 h-4 w-4" />
              Filter by category
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl w-56">
            <DropdownMenuItem onClick={() => onCategorySelect(null)}>
              <div className="flex items-center justify-between w-full">
                <span>All Words</span>
                <Badge variant="secondary">{wordsInCategory(null)}</Badge>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCategorySelect("uncategorized")}>
              <div className="flex items-center justify-between w-full">
                <span>Uncategorized</span>
                <Badge variant="secondary">{wordsInCategory("uncategorized")}</Badge>
              </div>
            </DropdownMenuItem>
            {categories?.map((category) => (
              <DropdownMenuItem
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </div>
                  <Badge variant="secondary">{wordsInCategory(category.id)}</Badge>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="rounded-3xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 px-6 h-12 text-sm transition-all duration-300"
            >
              Sort by{" "}
              {sortBy === "a-z"
                ? "A-Z"
                : sortBy === "z-a"
                ? "Z-A"
                : sortBy === "newest"
                ? "Newest"
                : "Oldest"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl">
            <DropdownMenuItem onClick={() => onSortChange("a-z")}>
              A to Z
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("z-a")}>
              Z to A
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("newest")}>
              Newest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("oldest")}>
              Oldest First
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
