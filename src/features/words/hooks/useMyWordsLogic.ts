'use client';

import { useState, useEffect, useMemo } from "react";
import { useUserWords, useWordCategories, useAssignWordToCategory, type UserWord } from "./useWords";

type SortOption = "a-z" | "z-a" | "newest" | "oldest";

/**
 * useMyWordsLogic Hook
 * 
 * Centralizes business logic for My Words page:
 * - Word filtering and sorting
 * - Pagination management
 * - Category word counting
 * - Category assignment
 * 
 * @param selectedCategory - Currently selected category ID
 * @returns All state and handlers for My Words page
 */
export function useMyWordsLogic(selectedCategory: string | null) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("a-z");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch data
  const { data: allWords } = useUserWords();
  const { data: words, isLoading } = useUserWords(selectedCategory);
  const { data: categories } = useWordCategories();
  const assignToCategory = useAssignWordToCategory();

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  // Filter and sort words
  const filteredWords = useMemo(() => {
    if (!words) return [];

    let filtered = words.filter((word) => {
      const matchesSearch =
        word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.example_sentences?.some((sentence) =>
          sentence.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesSearch;
    });

    // Sort words
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "a-z":
          return a.word.localeCompare(b.word);
        case "z-a":
          return b.word.localeCompare(a.word);
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [words, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil((filteredWords?.length || 0) / itemsPerPage);
  const paginatedWords = useMemo(() => {
    return filteredWords?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredWords, currentPage, itemsPerPage]);

  // Count words in category
  const wordsInCategory = (categoryId: string | null): number => {
    if (categoryId === null) return allWords?.length || 0;
    const wordsWithCategory = (allWords || []) as UserWord[];
    if (categoryId === "uncategorized")
      return wordsWithCategory.filter((w) => !w.category_id).length;
    return wordsWithCategory.filter((w) => w.category_id === categoryId).length;
  };

  // Handle category assignment
  const handleCategoryChange = async (wordId: string, categoryId: string | null) => {
    try {
      await assignToCategory.mutateAsync({
        wordId,
        categoryId,
      });
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  return {
    // Data
    words,
    filteredWords,
    paginatedWords,
    categories,
    isLoading,
    
    // Search & Sort
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    
    // Pagination
    currentPage,
    totalPages,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    
    // Utilities
    wordsInCategory,
    handleCategoryChange,
  };
}
