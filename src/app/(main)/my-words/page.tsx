"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddWordDialog } from "@/features/words/components/addWordDialog";
import { UpdateWordDialog } from "@/features/words/components/UpdateWordDialog";
import { FlashcardPractice } from "@/features/words/components/FlashcardPractice";
import { WordCard } from "@/features/words/components/WordCard";
import {
  useUserWords,
  useWordCategories,
  useCreateCategory,
  useDeleteCategory,
  useAssignWordToCategory,
  useDeleteWord,
  UserWord,
} from "@/features/words/hooks/useWords";
import {
  BookOpen,
  Plus,
  Search,
  Folder,
  FolderPlus,
  Edit2,
  Trash2,
  Lock,
  Download,
  Play,
  Crown,
  ChevronDown,
  ArrowLeft,
  Moon,
  Sun,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MyWordsPage() {
  const router = useRouter();
  const { user, profile, isPremium } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [editWord, setEditWord] = useState<any>(null);
  const [deleteWord, setDeleteWord] = useState<any>(null);
  const [sortBy, setSortBy] = useState<"a-z" | "z-a" | "newest" | "oldest">(
    "a-z"
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const { data: allWords } = useUserWords();
  const { data: words, isLoading } = useUserWords(selectedCategory);
  const { data: categories } = useWordCategories();

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-white dark:bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-12 text-center">
              <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mx-auto mb-6">
                <Crown className="h-12 w-12 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                My Words is a Premium Feature
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Upgrade to Premium to save and organize your vocabulary
              </p>
              <Button
                onClick={() => router.push("/premium")}
                className="rounded-3xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300 px-8 py-6 text-base"
              >
                <Crown className="mr-2 h-5 w-5" />
                Upgrade to Premium
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredWords = words
    ?.filter((word) => {
      const matchesSearch =
        word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.example_sentences?.some(sentence => 
          sentence.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesSearch;
    })
    .sort((a, b) => {
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

  const totalPages = Math.ceil((filteredWords?.length || 0) / itemsPerPage);
  const paginatedWords = filteredWords?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  const wordsInCategory = (categoryId: string | null) => {
    if (categoryId === null) return allWords?.length || 0;
    const wordsWithCategory = (allWords || []) as any[];
    if (categoryId === "uncategorized")
      return wordsWithCategory.filter((w) => !w.category_id).length;
    return wordsWithCategory.filter((w) => w.category_id === categoryId).length;
  };

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
      <aside className="hidden lg:flex w-64 bg-white dark:bg-card border-r border-gray-200 dark:border-gray-800 min-h-screen flex-col fixed left-0 top-0">
        <div className="p-6 flex-1">
          {/* Categories Header */}
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">
              Categories
            </h2>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory(null)}
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
                onClick={() => setSelectedCategory("uncategorized")}
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
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                    selectedCategory === category.id
                      ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <Badge variant="secondary" className="rounded-full">
                    {wordsInCategory(category.id)}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Add Category Button */}
          <Button
            variant="outline"
            className="w-full rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300"
            onClick={() => setShowCategoryDialog(true)}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Content Area */}
        <div className="flex-1 p-6">
          {/* Top Bar with Search and Add Button */}
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
                  onClick={toggleDarkMode}
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
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 rounded-3xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-300 dark:focus:border-orange-600 h-12 text-sm w-full"
                  />
                </div>

                {/* Add New Word Button */}
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="rounded-3xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300 px-6 h-12 text-sm whitespace-nowrap"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Word
                </Button>
              </div>
            </div>

            {/* Action Buttons and Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => setShowFlashcards(true)}
                disabled={!filteredWords || filteredWords.length === 0}
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
                    <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                      <div className="flex items-center justify-between w-full">
                        <span>All Words</span>
                        <Badge variant="secondary">
                          {wordsInCategory(null)}
                        </Badge>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedCategory("uncategorized")}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>Uncategorized</span>
                        <Badge variant="secondary">
                          {wordsInCategory("uncategorized")}
                        </Badge>
                      </div>
                    </DropdownMenuItem>
                    {categories?.map((category) => (
                      <DropdownMenuItem
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span>{category.name}</span>
                          </div>
                          <Badge variant="secondary">
                            {wordsInCategory(category.id)}
                          </Badge>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
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
                    <DropdownMenuItem onClick={() => setSortBy("a-z")}>
                      A to Z
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("z-a")}>
                      Z to A
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("newest")}>
                      Newest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                      Oldest First
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-12">
              <div className="text-center">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48 mx-auto" />
                  <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                </div>
              </div>
            </div>
          ) : words && words.length > 0 ? (
            filteredWords && filteredWords.length > 0 ? (
              <div className="space-y-4">
                {/* Table Container with Scroll */}
                <div className="">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="col-span-3 text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                      Word
                    </div>
                    <div className="col-span-4 text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                      Exemple Sentences
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
                      {paginatedWords?.map((word) => (
                        <WordRow key={word.id} word={word} onEdit={setEditWord} onDelete={setDeleteWord} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Items per page:
                    </span>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={(value) => {
                        setItemsPerPage(Number(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="rounded-2xl h-9 w-20 border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(currentPage * itemsPerPage, filteredWords.length)} of{" "}
                      {filteredWords.length} words
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="rounded-2xl border-2 h-9 px-3"
                    >
                      First
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="rounded-2xl border-2 h-9 px-3"
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600 dark:text-gray-300 px-3">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="rounded-2xl border-2 h-9 px-3"
                    >
                      Next
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="rounded-2xl border-2 h-9 px-3"
                    >
                      Last
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No words found
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )
          ) : (
            <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-12 text-center">
              <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-12 w-12 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No words yet
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Start building your vocabulary by adding words from reading
                texts or manually.
              </p>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="rounded-3xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300 px-8 py-6 text-base"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Your First Word
              </Button>
            </div>
          )}
        </div>
      </div>

      <AddWordDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        initialCategoryId={selectedCategory === "uncategorized" ? null : selectedCategory}
      />

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
    </div>
  );
}

function WordRow({ word, onEdit, onDelete }: { word: UserWord; onEdit: (word: UserWord) => void; onDelete: (word: UserWord) => void }) {
  const { data: categories } = useWordCategories();
  const assignToCategory = useAssignWordToCategory();

  const category = categories?.find((c) => c.id === word.category_id);

  const handleCategoryChange = async (newCategoryId: string) => {
    try {
      await assignToCategory.mutateAsync({
        wordId: word.id,
        categoryId: newCategoryId === "none" ? null : newCategoryId,
      });
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-4  rounded-4xl clay-shadow">
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
            <DropdownMenuItem onClick={() => handleCategoryChange("none")}>
              <span className="text-sm">Uncategorized</span>
            </DropdownMenuItem>
            {categories?.map((cat) => (
              <DropdownMenuItem
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
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

function CategoryDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const createCategory = useCreateCategory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory.mutate(
      { name, color },
      {
        onSuccess: () => {
          setName("");
          setColor("#3b82f6");
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create Category
          </DialogTitle>
          <DialogDescription className="text-base">
            Organize your words into categories
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">
              Category Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Business English, Travel"
              required
              className="rounded-2xl h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color" className="text-sm font-semibold">
              Color
            </Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-16 h-16 rounded-2xl cursor-pointer border-2 border-gray-200 dark:border-gray-700"
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="rounded-2xl h-12 text-base"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-2xl h-12 text-base border-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-2xl h-12 text-base bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-[0_4px_14px_rgba(249,115,22,0.4)]"
            >
              Create Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteConfirmDialog({
  word,
  open,
  onClose,
}: {
  word: any;
  open: boolean;
  onClose: () => void;
}) {
  const deleteWordMutation = useDeleteWord();

  const handleDelete = async () => {
    if (!word) return;
    
    try {
      await deleteWordMutation.mutateAsync(word.id);
      onClose();
    } catch (error) {
      console.error("Error deleting word:", error);
    }
  };

  if (!word) return null;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold">Delete Word</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Are you sure you want to delete "<span className="font-semibold text-gray-900 dark:text-white">{word.word}</span>"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 sm:gap-3">
          <AlertDialogCancel 
            onClick={onClose}
            className="rounded-2xl h-12 text-base border-2"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteWordMutation.isPending}
            className="rounded-2xl h-12 text-base bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-[0_4px_14px_rgba(239,68,68,0.4)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.5)] transition-all duration-300"
          >
            {deleteWordMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
