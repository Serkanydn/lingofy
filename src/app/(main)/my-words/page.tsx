"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddWordDialog } from "@/features/words/components/addWordDialog";
import { FlashcardPractice } from "@/features/words/components/FlashcardPractice";
import { WordCard } from "@/features/words/components/WordCard";
import {
  useUserWords,
  useWordCategories,
  useCreateCategory,
  useDeleteCategory,
  useAssignWordToCategory,
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
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  
  const { data: allWords } = useUserWords();
  const { data: words, isLoading } = useUserWords(selectedCategory);
  const { data: categories } = useWordCategories();

  if (!isPremium) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-muted p-4 rounded-full">
                <Lock className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">My Words is a Premium Feature</CardTitle>
            <CardDescription className="text-base">
              Upgrade to Premium to save and organize your vocabulary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              size="lg"
              onClick={() => router.push('/premium')}
              className="bg-linear-to-r from-yellow-400 to-orange-500"
            >
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredWords = words?.filter((word) => {
    const matchesSearch =
      word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.translation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Words</h1>
        <p className="text-muted-foreground">
          Your personal vocabulary collection organized in categories
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading your words...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  Categories
                </h2>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowCategoryDialog(true)}
                >
                  <FolderPlus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === null
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>All Words</span>
                    <Badge variant="secondary">{wordsInCategory(null)}</Badge>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedCategory("uncategorized")}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === "uncategorized"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Uncategorized</span>
                    <Badge variant="secondary">
                      {wordsInCategory("uncategorized")}
                    </Badge>
                  </div>
                </button>

                {categories?.map((category) => (
                  <div key={category.id} className="group relative">
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === category.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between">
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
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Words */}
          <div className="lg:col-span-3">
            {words && words.length > 0 ? (
              <>
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search words..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button onClick={() => setShowAddDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Word
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowFlashcards(true)}
                    disabled={!filteredWords || filteredWords.length === 0}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Practice
                  </Button>
                </div>

                {filteredWords && filteredWords.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredWords.map((word) => (
                      <WordCard key={word.id} word={word} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No words found matching your search or in this category.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="mb-6">
                  <BookOpen className="h-20 w-20 mx-auto text-muted-foreground/50" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">No words yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start building your vocabulary by adding words from reading
                  texts or manually.
                </p>
                <Button onClick={() => setShowAddDialog(true)} size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Your First Word
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <AddWordDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />

      <CategoryDialog
        open={showCategoryDialog}
        onClose={() => setShowCategoryDialog(false)}
      />
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>
            Organize your words into categories
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Business English, Travel"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer"
              />
              <Input value={color} onChange={(e) => setColor(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
