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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, FileQuestion } from "lucide-react";
import { useUpdateGrammarTopic } from "@/features/admin/hooks/useGrammarTopics";
import { GrammarCategory, Level } from "@/shared/types/common.types";
import { GrammarRule } from "@/features/grammar/types/service.types";
import { useRouter } from "next/navigation";

const CATEGORIES: GrammarCategory[] = [
  "tenses",
  "modals",
  "conditionals",
  "passive-voice",
  "reported-speech",
  "articles",
  "prepositions",
  "phrasal-verbs",
  "tricky-topics",
];

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1"];

interface EditGrammarDialogProps {
  open: boolean;
  onClose: () => void;
  topic: GrammarRule | null;
}

export function EditGrammarDialog({ open, onClose, topic }: EditGrammarDialogProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("");
  const [level, setLevel] = useState<string>("B1");
  const [explanation, setExplanation] = useState("");
  const [miniText, setMiniText] = useState("");
  const [examples, setExamples] = useState<string[]>([""]);
  const [orderIndex, setOrderIndex] = useState("1");
  const [isPremium, setIsPremium] = useState(false);

  const updateTopic = useUpdateGrammarTopic();
  const router = useRouter();

  useEffect(() => {
    if (topic) {
      setTitle(topic.title);
      setCategory(topic.category);
      setLevel(topic.difficulty_level);
      setExplanation(topic.explanation);
      setMiniText(topic.mini_text);
      setExamples(topic.examples.length > 0 ? topic.examples : [""]);
      setOrderIndex(String(topic.order_index));
      setIsPremium(topic.is_premium);
    }
  }, [topic]);

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

    if (!topic || !category) return;

    await updateTopic.mutateAsync({
      id: topic.id,
      data: {
        title,
        category: category as GrammarCategory,
        difficulty_level: level as Level,
        explanation,
        mini_text: miniText,
        examples: examples.filter((ex) => ex.trim() !== ""),
        order_index: parseInt(orderIndex),
        is_premium: isPremium,
        updated_at: new Date().toISOString(),
      },
    });

    onClose();
  };

  const handleManageQuestions = () => {
    if (!topic) return;
    onClose();
    router.push(`/admin/grammar/${topic.id}/questions`);
  };

  if (!topic) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Grammar Topic</DialogTitle>
          <DialogDescription>
            Update the grammar lesson details
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={(val) => setCategory(val as GrammarCategory)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Difficulty Level *</Label>
              <Select value={level} onValueChange={(val) => setLevel(val as Level)} required>
                <SelectTrigger>
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
                min="1"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPremium"
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isPremium">Premium Content</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation *</Label>
            <Textarea
              id="explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain the grammar concept..."
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
                />
                {examples.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveExample(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddExample}
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
              rows={6}
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
              type="button"
              variant="secondary"
              onClick={handleManageQuestions}
              className="flex-1"
            >
              <FileQuestion className="mr-2 h-4 w-4" />
              Manage Questions
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={updateTopic.isPending}
            >
              {updateTopic.isPending ? "Updating..." : "Update Topic"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
