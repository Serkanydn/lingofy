"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddWordDialog } from "@/features/words/components/addWordDialog";
import { FlashcardPractice } from "@/features/words/components/FlashcardPractice";
import { WordCard } from "@/features/words/components/WordCard";
import { useUserWords } from "@/features/words/hooks/useWords";
import { BookOpen, Plus, Search } from "lucide-react";
import { useState } from "react";

export default function MyWordsPage() {
  const { data: words, isLoading } = useUserWords();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWords = words?.filter(
    (word) =>
      word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.translation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (showFlashcards && words && words.length > 0) {
    return (
      <FlashcardPractice
        words={words}
        onExit={() => setShowFlashcards(false)}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Words</h1>
        <p className="text-muted-foreground">
          Your personal vocabulary collection
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading your words...</div>
      ) : words && words.length > 0 ? (
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
            <Button variant="outline" onClick={() => setShowFlashcards(true)}>
              <BookOpen className="mr-2 h-4 w-4" />
              Practice Flashcards
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
                No words found matching your search.
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
            Start building your vocabulary by adding words from reading texts or
            manually.
          </p>
          <Button onClick={() => setShowAddDialog(true)} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Add Your First Word
          </Button>
        </div>
      )}

      <AddWordDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />
    </div>
  );
}
