'use client';

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface FilterBarProps {
  sortBy: "newest" | "oldest";
  setSortBy: (value: "newest" | "oldest") => void;
  accessFilter: "all" | "free" | "premium";
  setAccessFilter: (value: "all" | "free" | "premium") => void;
}

/**
 * FilterBar Component
 * 
 * Provides filtering and sorting controls for listening exercises.
 * Includes dropdowns for sort order and access type.
 * 
 * @component
 */
export function FilterBar({
  sortBy,
  setSortBy,
  accessFilter,
  setAccessFilter,
}: FilterBarProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="rounded-2xl bg-white dark:bg-card shadow-[0_4px_14px_rgb(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgb(0,0,0,0.1)] transition-all duration-300 px-5"
          >
            Sort: {sortBy === "newest" ? "Newest" : "Oldest"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="rounded-2xl">
          <DropdownMenuItem
            onClick={() => setSortBy("newest")}
            className="cursor-pointer"
          >
            Newest
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setSortBy("oldest")}
            className="cursor-pointer"
          >
            Oldest
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Access Type Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "rounded-2xl bg-white dark:bg-card shadow-[0_4px_14px_rgb(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgb(0,0,0,0.1)] transition-all duration-300 px-5",
              accessFilter !== "all" &&
                "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
            )}
          >
            {accessFilter === "all"
              ? "All Access"
              : accessFilter === "free"
              ? "Free"
              : "Premium"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="rounded-2xl">
          <DropdownMenuItem
            onClick={() => setAccessFilter("all")}
            className="cursor-pointer"
          >
            All Access
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setAccessFilter("free")}
            className="cursor-pointer"
          >
            Free
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setAccessFilter("premium")}
            className="cursor-pointer"
          >
            Premium
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
