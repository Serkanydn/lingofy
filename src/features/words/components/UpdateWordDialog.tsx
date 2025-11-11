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
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useUpdateWord,
  useWordCategories,
  useAssignWordToCategory,
  UserWord,
} from "../hooks/useWords";

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
  const [description, setDescription] = useState(word.description);
  const [exampleSentences, setExampleSentences] = useState<string[]>(
    word.example_sentences || [""]
  );
  const [categoryId, setCategoryId] = useState<string>(
    (word as any).category_id || "none"
  );
  const updateWord = useUpdateWord();
  const assignToCategory = useAssignWordToCategory();
  const { data: categories } = useWordCategories();

  useEffect(() => {
    if (open) {
      setWordText(word.word);
      setDescription(word.description);
      setExampleSentences(word.example_sentences || [""]);
      setCategoryId((word as any).category_id || "none");
    }
  }, [open, word]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !wordText ||
      !description ||
      exampleSentences.filter((s) => s.trim()).length === 0
    ) {
      toast.error(
        "Please fill in all required fields and at least one example"
      );
      return;
    }

    try {
      await updateWord.mutateAsync({
        id: word.id,
        updates: {
          word: wordText,
          description,
          example_sentences: exampleSentences.filter((s) => s.trim()),
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
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update word";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Update Word</DialogTitle>
          <DialogDescription className="text-base">
            Update the word in your vocabulary collection
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="word" className="text-sm font-semibold">
              English Word *
            </Label>
            <Input
              id="word"
              value={wordText}
              onChange={(e) => setWordText(e.target.value)}
              placeholder="e.g., excellent"
              required
              className="rounded-2xl h-12 text-base border-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Description *
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., An adjective meaning very good or of high quality"
              rows={3}
              required
              className="rounded-2xl text-base border-2"
            />
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="category" className="text-sm font-semibold">
              Category
            </Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="w-full rounded-2xl h-12 border-2">
                <SelectValue placeholder="Select a category (optional)" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="none">Uncategorized</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Example Sentences *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setExampleSentences([...exampleSentences, ""])}
                className="rounded-2xl border-2"
              >
                <Plus className="mr-1 h-3 w-3" />
                Add Example
              </Button>
            </div>
            <div className="space-y-3">
              {exampleSentences.map((example, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={example}
                    onChange={(e) => {
                      const updated = [...exampleSentences];
                      updated[index] = e.target.value;
                      setExampleSentences(updated);
                    }}
                    placeholder={`Example ${
                      index + 1
                    }: She did an excellent job on the project.`}
                    rows={2}
                    required={index === 0}
                    className="rounded-2xl text-base border-2"
                  />
                  {exampleSentences.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setExampleSentences(
                          exampleSentences.filter((_, i) => i !== index)
                        );
                      }}
                      className="rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 h-10 w-10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
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
              className="flex-1 rounded-2xl h-12 text-base bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300"
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
