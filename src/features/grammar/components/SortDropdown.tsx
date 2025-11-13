'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

type SortOption = "newest" | "oldest";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

/**
 * SortDropdown Component
 * 
 * Dropdown menu for sorting topics by date.
 * Options: Newest, Oldest
 * 
 * @component
 */
export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-2xl bg-white dark:bg-card shadow-[0_4px_14px_rgb(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgb(0,0,0,0.1)] transition-all duration-300 px-5"
        >
          Sort: {value === "newest" ? "Newest" : "Oldest"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-2xl">
        <DropdownMenuItem
          onClick={() => onChange("newest")}
          className="cursor-pointer"
        >
          Newest
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onChange("oldest")}
          className="cursor-pointer"
        >
          Oldest
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
