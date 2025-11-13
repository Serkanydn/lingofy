'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Moon, Sun, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface WordsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddWord: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

/**
 * WordsHeader Component
 * 
 * Top header section with:
 * - Title and Premium badge
 * - Mobile back button
 * - Dark mode toggle
 * - Search input
 * - Add word button
 * 
 * @component
 */
export function WordsHeader({
  searchQuery,
  onSearchChange,
  onAddWord,
  isDarkMode,
  onToggleDarkMode,
}: WordsHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        {/* Mobile Back Button */}
        <div className="lg:hidden">
          <Button
            variant="outline"
            className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300"
            onClick={() => router.push("/reading")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Title, Description and Premium Badge */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              My Words
            </h1>
            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1 text-xs rounded-full uppercase font-bold">
              Premium
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Manage your saved words and practice with flashcards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            className="relative w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 clay-shadow-inset"
          >
            {isDarkMode ? (
              <Sun className="h-[18px] w-[18px] text-orange-500" />
            ) : (
              <Moon className="h-[18px] w-[18px] text-gray-600" />
            )}
          </Button>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md ml-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Find specific words..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 rounded-3xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-300 dark:focus:border-orange-600 h-12 text-sm w-full"
            />
          </div>

          {/* Add New Word Button */}
          <Button
            onClick={onAddWord}
            className="rounded-3xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300 px-6 h-12 text-sm whitespace-nowrap"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Word
          </Button>
        </div>
      </div>
    </div>
  );
}
