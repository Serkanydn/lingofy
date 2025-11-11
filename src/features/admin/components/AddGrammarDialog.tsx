"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { useCreateGrammarTopic } from "@/features/admin/hooks/useGrammarTopics";
import { useActiveGrammarCategories } from "@/features/admin/hooks/useGrammarCategories";
import { Level } from "@/shared/types/common.types";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1"];

interface AddGrammarDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddGrammarDialog({ open, onClose }: AddGrammarDialogProps) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [level, setLevel] = useState<Level>("B1");
  const [explanation, setExplanation] = useState("");
  const [miniText, setMiniText] = useState("");
  const [examples, setExamples] = useState<string[]>([""]);
  const [orderIndex, setOrderIndex] = useState("1");
  const [isPremium, setIsPremium] = useState(false);

  const createTopic = useCreateGrammarTopic();
  const { data: categories, isLoading: categoriesLoading } = useActiveGrammarCategories();

  const handleAddExample = () => {
    setExamples([...examples, ""]);
  };

  const handleRemoveExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index));
  };

  const handleExampleChange = (index: number, value: string) => {
    const newExamples = [...examples];
    newExamples[index] = value;
    setExamples(newExamples);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId) return;

    await createTopic.mutateAsync({
      title,
      category_id: categoryId,
      difficulty_level: level,
      explanation,
      mini_text: miniText,
      examples: examples.filter((ex) => ex.trim() !== ""),
      order_index: parseInt(orderIndex),
      is_premium: isPremium,
      updated_at: new Date().toISOString(),
      content_id: crypto.randomUUID(),
    });

    // Reset form
    setTitle("");
    setCategoryId("");
    setLevel("B1");
    setExplanation("");
    setMiniText("");
    setExamples([""]);
    setOrderIndex("1");
    setIsPremium(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border-0">
        <DialogHeader className="space-y-4 pb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(251,191,36,0.4)]">
            <span className="text-4xl">📚</span>
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">Add Grammar Topic</DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-gray-400">
            Create a new grammar lesson with examples
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Present Perfect vs Past Simple"
                className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required disabled={categoriesLoading}>
                <SelectTrigger className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 w-full">
                  <SelectValue placeholder={categoriesLoading ? "Loading..." : "Select category"} />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Difficulty Level *</Label>
              <Select value={level} onValueChange={(val) => setLevel(val as Level)} required>
                <SelectTrigger className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 w-full">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((lvl) => (
                    <SelectItem key={lvl} value={lvl}>
                      {lvl}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderIndex">Order Index</Label>
              <Input
                id="orderIndex"
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(e.target.value)}
                className="rounded-2xl border-2 border-gray-200 dark:border-gray-700"
                min="1"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-900/10 border-2 border-orange-100 dark:border-orange-900/30">
            <input
              type="checkbox"
              id="isPremium"
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
              className="h-5 w-5 rounded-lg border-2 border-orange-300 text-orange-500 focus:ring-orange-500 focus:ring-2 focus:ring-offset-2"
            />
            <Label htmlFor="isPremium" className="text-sm font-semibold text-orange-700 dark:text-orange-400 cursor-pointer flex items-center gap-2">
              <span>👑</span> Premium Content
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation *</Label>
            <Textarea
              id="explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain the grammar concept..."
              className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Examples *</Label>
            {examples.map((example, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={example}
                  onChange={(e) => handleExampleChange(index, e.target.value)}
                  placeholder={`Example ${index + 1}`}
                  className="rounded-2xl border-2 border-gray-200 dark:border-gray-700"
                />
                {examples.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveExample(index)}
                    className="rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddExample}
              className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Example
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="miniText">Practice Text *</Label>
            <Textarea
              id="miniText"
              value={miniText}
              onChange={(e) => setMiniText(e.target.value)}
              placeholder="A short text demonstrating the grammar concept..."
              className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300"
              rows={6}
              required
            />
          </div>

          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300"
              disabled={createTopic.isPending}
            >
              {createTopic.isPending ? "Creating..." : "Create Topic"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
