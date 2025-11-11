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
  useAddWord,
  useWordCategories,
  useAssignWordToCategory,
} from "../hooks/useWords";

interface AddWordDialogProps {
  open: boolean;
  onClose: () => void;
  initialWord?: string;
  sourceType?: "reading" | "listening";
  sourceId?: string;
  initialCategoryId?: string | null;
}

export function AddWordDialog({
  open,
  onClose,
  initialWord = "",
  sourceType,
  sourceId,
  initialCategoryId = null,
}: AddWordDialogProps) {
  const [word, setWord] = useState(initialWord);
  const [description, setDescription] = useState("");
  const [exampleSentences, setExampleSentences] = useState<string[]>([""]);
  const [categoryId, setCategoryId] = useState<string>("none");
  const addWord = useAddWord();
  const assignToCategory = useAssignWordToCategory();
  const { data: categories } = useWordCategories();

  useEffect(() => {
    if (open) {
      setWord(initialWord);
      setCategoryId(initialCategoryId || "none");
    }
  }, [open, initialWord, initialCategoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("word", word);
    console.log("description", description);
    console.log("exampleSentences", exampleSentences);

    if (
      !word ||
      !description ||
      exampleSentences.filter((s) => s.trim()).length === 0
    ) {
      toast.error(
        "Please fill in all required fields and at least one example"
      );
      return;
    }

    try {
      const newWord = await addWord.mutateAsync({
        word,
        description,
        example_sentences: exampleSentences.filter((s) => s.trim()),
        source_type: sourceType,
        source_id: sourceId,
      });

      // Assign the word to the selected category (or leave uncategorized)
      if (categoryId && categoryId !== "none") {
        await assignToCategory.mutateAsync({
          wordId: newWord.id,
          categoryId,
        });
      }

      toast.success("Word added to your collection!");

      // Reset form
      setWord("");
      setDescription("");
      setExampleSentences([""]);
      setCategoryId("none");
      onClose();
    } catch (error) {
      console.error("Error adding word:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add word";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Word</DialogTitle>
          <DialogDescription className="text-base">
            Add a new word to your personal vocabulary collection
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="word" className="text-sm font-semibold">
              English Word *
            </Label>
            <Input
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
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
              disabled={addWord.isPending}
            >
              {addWord.isPending ? "Adding..." : "Add Word"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
