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
import { useAddWord, useWordCategories, useAssignWordToCategory } from "../hooks/useWords";

interface AddWordDialogProps {
  open: boolean;
  onClose: () => void;
  initialWord?: string;
  sourceType?: "reading" | "listening";
  sourceId?: string;
}

export function AddWordDialog({
  open,
  onClose,
  initialWord = "",
  sourceType,
  sourceId,
}: AddWordDialogProps) {
  const [word, setWord] = useState(initialWord);
  const [translation, setTranslation] = useState("");
  const [description, setDescription] = useState("");
  const [exampleSentences, setExampleSentences] = useState<string[]>([""]);
  const [categoryId, setCategoryId] = useState<string>("none");
  const addWord = useAddWord();
  const assignToCategory = useAssignWordToCategory();
  const { data: categories } = useWordCategories();

  useEffect(() => {
    if (open) {
      setWord(initialWord);
    }
  }, [open, initialWord]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!word || !translation || !description || exampleSentences.filter(s => s.trim()).length === 0) {
      toast.error("Please fill in all required fields and at least one example");
      return;
    }

    try {
      const newWord = await addWord.mutateAsync({
        word,
        translation,
        description,
        example_sentences: exampleSentences.filter(s => s.trim()),
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
      setTranslation("");
      setDescription("");
      setExampleSentences([""]);
      setCategoryId("none");
      onClose();
    } catch (error) {
      console.error("Error adding word:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to add word";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Word</DialogTitle>
          <DialogDescription>
            Add a new word to your personal vocabulary collection
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="word">English Word *</Label>
            <Input
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="e.g., excellent"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., An adjective meaning very good or of high quality"
              rows={2}
              required
            />
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId} >
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
            <div className="flex items-center justify-between">
              <Label>Example Sentences *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setExampleSentences([...exampleSentences, ""])}
              >
                <Plus className="mr-1 h-3 w-3" />
                Add Example
              </Button>
            </div>
            {exampleSentences.map((example, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={example}
                  onChange={(e) => {
                    const updated = [...exampleSentences];
                    updated[index] = e.target.value;
                    setExampleSentences(updated);
                  }}
                  placeholder={`Example ${index + 1}: She did an excellent job on the project.`}
                  rows={2}
                  required={index === 0}
                />
                {exampleSentences.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setExampleSentences(exampleSentences.filter((_, i) => i !== index));
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
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
              disabled={addWord.isPending}
            >
              {addWord.isPending ? "Adding..." : "Add Word"}
            </Button>{" "}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
