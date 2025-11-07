"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateWord, useWordCategories, useAssignWordToCategory, UserWord } from "../hooks/useWords";

interface UpdateWordDialogProps {
  open: boolean;
  onClose: () => void;
  word: UserWord;
}

export function UpdateWordDialog({
  open,
  onClose,
  word,
}: UpdateWordDialogProps) {
  const [wordText, setWordText] = useState(word.word);
  const [translation, setTranslation] = useState(word.translation);
  const [exampleEn, setExampleEn] = useState(word.example_sentence_en);
  const [exampleTr, setExampleTr] = useState(word.example_sentence_tr);
  const [categoryId, setCategoryId] = useState<string>((word as any).category_id || "none");
  const updateWord = useUpdateWord();
  const assignToCategory = useAssignWordToCategory();
  const { data: categories } = useWordCategories();

  useEffect(() => {
    if (open) {
      setWordText(word.word);
      setTranslation(word.translation);
      setExampleEn(word.example_sentence_en);
      setExampleTr(word.example_sentence_tr);
      setCategoryId((word as any).category_id || "none");
    }
  }, [open, word]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wordText || !translation || !exampleEn || !exampleTr) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await updateWord.mutateAsync({
        id: word.id,
        updates: {
          word: wordText,
          translation,
          example_sentence_en: exampleEn,
          example_sentence_tr: exampleTr,
        },
      });

      // Update category if changed
      const currentCategoryId = (word as any).category_id || "none";
      if (categoryId !== currentCategoryId) {
        await assignToCategory.mutateAsync({
          wordId: word.id,
          categoryId: categoryId === "none" ? null : categoryId,
        });
      }

      toast.success("Word updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating word:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update word";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Word</DialogTitle>
          <DialogDescription>
            Update the word in your vocabulary collection
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="word">English Word *</Label>
            <Input
              id="word"
              value={wordText}
              onChange={(e) => setWordText(e.target.value)}
              placeholder="e.g., excellent"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="translation">Turkish Translation *</Label>
            <Input
              id="translation"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="e.g., mükemmel"
              required
            />
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Uncategorized</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exampleEn">Example Sentence (English) *</Label>
            <Textarea
              id="exampleEn"
              value={exampleEn}
              onChange={(e) => setExampleEn(e.target.value)}
              placeholder="e.g., She did an excellent job on the project."
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exampleTr">Example Sentence (Turkish) *</Label>
            <Textarea
              id="exampleTr"
              value={exampleTr}
              onChange={(e) => setExampleTr(e.target.value)}
              placeholder="e.g., Projede mükemmel bir iş çıkardı."
              rows={2}
              required
            />
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
            <Button
              type="submit"
              className="flex-1"
              disabled={updateWord.isPending}
            >
              {updateWord.isPending ? "Updating..." : "Update Word"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
