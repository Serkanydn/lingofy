'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/hooks/useAuth";
import { FlashcardPractice } from "../components/FlashcardPractice";
import { UpdateWordDialog } from "../components/UpdateWordDialog";
import { AddWordDialog } from "../components/addWordDialog";
import { WordsSidebar } from "../components/WordsSidebar";
import { WordsHeader } from "../components/WordsHeader";
import { WordsActionBar } from "../components/WordsActionBar";
import { WordsTable } from "../components/WordsTable";
import { WordsPagination } from "../components/WordsPagination";
import { EmptyStates } from "../components/EmptyStates";
import { PremiumGate } from "../components/PremiumGate";
import { CategoryDialog } from "../components/CategoryDialog";
import { EditCategoryDialog } from "../components/EditCategoryDialog";
import { DeleteCategoryDialog } from "../components/DeleteCategoryDialog";
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog";
import { useMyWordsLogic } from "../hooks/useMyWordsLogic";
import type { UserWord, WordCategory } from "../hooks/useWords";

/**
 * MyWordsPageClient Component
 * 
 * Main client component for My Words page.
 * Orchestrates all word management features:
 * - Category sidebar navigation
 * - Search and filtering
 * - Word table with pagination
 * - Flashcard practice mode
 * - Word CRUD operations
 * 
 * @component
 */
export function MyWordsPageClient() {
  const router = useRouter();
  const { isPremium } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [editWord, setEditWord] = useState<UserWord | null>(null);
  const [deleteWord, setDeleteWord] = useState<UserWord | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAddWord, setShowAddWord] = useState(false);
  const [editCategory, setEditCategory] = useState<WordCategory | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<WordCategory | null>(null);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const {
    words,
    filteredWords,
    paginatedWords,
    categories,
    isLoading,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    currentPage,
    totalPages,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    wordsInCategory,
    handleCategoryChange,
  } = useMyWordsLogic(selectedCategory);

  // Show premium gate for non-premium users
  if (!isPremium) {
    return <PremiumGate />;
  }

  // Show flashcard practice mode
  if (showFlashcards && filteredWords && filteredWords.length > 0) {
    return (
      <FlashcardPractice
        words={filteredWords}
        onExit={() => setShowFlashcards(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background flex">
      {/* Sidebar */}
      <WordsSidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        onAddCategory={() => setShowCategoryDialog(true)}
        wordsInCategory={wordsInCategory}
        onEditCategory={(cat) => setEditCategory(cat)}
        onDeleteCategory={(cat) => setDeleteCategory(cat)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <div className="flex-1 p-6">
          {/* Header */}
          <WordsHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddWord={() => setShowAddWord(true)}
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
          />

          {/* Action Bar */}
          <WordsActionBar
            onStartFlashcards={() => setShowFlashcards(true)}
            isFlashcardsDisabled={!filteredWords || filteredWords.length === 0}
            sortBy={sortBy}
            onSortChange={setSortBy}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            categories={categories}
            wordsInCategory={wordsInCategory}
          />

          {/* Content Area */}
          {isLoading ? (
            <EmptyStates type="loading" />
          ) : words && words.length > 0 ? (
            filteredWords && filteredWords.length > 0 ? (
              <div className="space-y-4 mt-6">
                <WordsTable
                  words={paginatedWords || []}
                  categories={categories}
                  onEdit={setEditWord}
                  onDelete={setDeleteWord}
                  onCategoryChange={handleCategoryChange}
                />
                <WordsPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredWords.length}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </div>
            ) : (
              <div className="mt-6">
                <EmptyStates type="no-results" />
              </div>
            )
          ) : (
            <div className="mt-6">
              <EmptyStates
                type="no-words"
                onAddWord={() => setShowAddWord(true)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      {editWord && (
        <UpdateWordDialog
          word={editWord}
          open={true}
          onClose={() => setEditWord(null)}
        />
      )}

      <CategoryDialog
        open={showCategoryDialog}
        onClose={() => setShowCategoryDialog(false)}
      />

      <DeleteConfirmDialog
        word={deleteWord}
        open={!!deleteWord}
        onClose={() => setDeleteWord(null)}
      />

      <EditCategoryDialog
        open={!!editCategory}
        onClose={() => setEditCategory(null)}
        category={editCategory}
      />

      <DeleteCategoryDialog
        open={!!deleteCategory}
        onClose={() => setDeleteCategory(null)}
        category={deleteCategory}
        onDeleted={() => {
          if (deleteCategory && selectedCategory === deleteCategory.id) {
            setSelectedCategory(null);
          }
        }}
      />

      <AddWordDialog
        open={showAddWord}
        onClose={() => setShowAddWord(false)}
        initialCategoryId={selectedCategory}
      />
    </div>
  );
}
