'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Folder, Plus, ArrowLeft, MoreVertical, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import type { WordCategory } from "../hooks/useWords";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WordsSidebarProps {
  categories: WordCategory[] | undefined;
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  onAddCategory: () => void;
  wordsInCategory: (categoryId: string | null) => number;
  onEditCategory?: (category: WordCategory) => void;
  onDeleteCategory?: (category: WordCategory) => void;
}

/**
 * WordsSidebar Component
 * 
 * Displays category navigation sidebar with:
 * - All Words and Uncategorized options
 * - Custom category list with color indicators
 * - Word count badges
 * - Add category button
 * - Back navigation button
 * 
 * @component
 */
export function WordsSidebar({
  categories,
  selectedCategory,
  onCategorySelect,
  onAddCategory,
  wordsInCategory,
  onEditCategory,
  onDeleteCategory,
}: WordsSidebarProps) {
  const router = useRouter();

  return (
    <aside className="hidden lg:flex w-64 bg-white dark:bg-card border-r border-gray-200 dark:border-gray-800 min-h-screen flex-col fixed left-0 top-0">
      <div className="p-6 flex-1">
        {/* Categories Header */}
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">
            Categories
          </h2>
          <div className="space-y-1">
            <button
              onClick={() => onCategorySelect(null)}
              className={`w-full text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                selectedCategory === null
                  ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4" />
                <span className="text-sm font-medium">All Words</span>
              </div>
              <Badge variant="secondary" className="rounded-full">
                {wordsInCategory(null)}
              </Badge>
            </button>

            <button
              onClick={() => onCategorySelect("uncategorized")}
              className={`w-full text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                selectedCategory === "uncategorized"
                  ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4" />
                <span className="text-sm font-medium">Uncategorized</span>
              </div>
              <Badge variant="secondary" className="rounded-full">
                {wordsInCategory("uncategorized")}
              </Badge>
            </button>

            {categories?.map((category) => (
              <div
                key={category.id}
                className={`w-full px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                  selectedCategory === category.id
                    ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <button
                  className="flex items-center gap-2 flex-1 text-left"
                  onClick={() => onCategorySelect(category.id)}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="rounded-full">
                    {wordsInCategory(category.id)}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem
                        onClick={() => onEditCategory?.(category)}
                        className="gap-2"
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDeleteCategory?.(category)}
                        className="gap-2 text-red-600 dark:text-red-400"
                      >
                        <Trash className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Category Button */}
        <Button
          variant="outline"
          className="w-full rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300"
          onClick={onAddCategory}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Category
        </Button>
      </div>

      {/* Back Button at Bottom */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-800">
        <Button
          variant="outline"
          className="w-full rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300"
          onClick={() => router.push("/reading")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
    </aside>
  );
}
