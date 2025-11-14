"use client";

import { useState, useEffect } from "react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { Level } from "@/shared/types/common.types";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1"];

interface GrammarFormProps {
  isOpen: boolean;
  onToggle: () => void;
  onSubmit: (data: GrammarFormData) => Promise<void>;
  initialData?: Partial<GrammarFormData>;
  categories?: Array<{ id: string; name: string; icon?: string }>;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

export interface GrammarFormData {
  title: string;
  category_id: string;
  difficulty_level: Level;
  explanation: string;
  mini_text: string;
  examples: string[];
  order_index: number;
  is_premium: boolean;
  updated_at: string;
  content_id: string;
}

export function GrammarForm({
  isOpen,
  onToggle,
  onSubmit,
  initialData,
  categories = [],
  isLoading = false,
  mode = "create",
}: GrammarFormProps) {
  const [formData, setFormData] = useState<GrammarFormData>({
    title: "",
    category_id: "",
    difficulty_level: "B1",
    explanation: "",
    mini_text: "",
    examples: [""],
    order_index: 1,
    is_premium: false,
    updated_at: new Date().toISOString(),
    content_id: crypto.randomUUID(),
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (field: keyof GrammarFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExampleChange = (index: number, value: string) => {
    const newExamples = [...formData.examples];
    newExamples[index] = value;
    setFormData((prev) => ({ ...prev, examples: newExamples }));
  };

  const addExample = () => {
    setFormData((prev) => ({ ...prev, examples: [...prev.examples, ""] }));
  };

  const removeExample = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      examples: formData.examples.filter((ex) => ex.trim() !== ""),
      updated_at: new Date().toISOString(),
    });
  };

  const handleReset = () => {
    setFormData({
      title: "",
      category_id: "",
      difficulty_level: "B1",
      explanation: "",
      mini_text: "",
      examples: [""],
      order_index: 1,
      is_premium: false,
      updated_at: new Date().toISOString(),
      content_id: crypto.randomUUID(),
    });
  };

  return (
    <Card className="mb-6 rounded-3xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300">
      {/* Header - Always Visible */}
      <div
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(251,191,36,0.4)]">
            <span className="text-2xl">📚</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === "create" ? "Add New Grammar Topic" : "Edit Grammar Topic"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isOpen ? "Click to collapse" : "Click to expand the form"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-xl">
          {isOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Form Content - Collapsible */}
      {isOpen && (
        <CardContent className="pt-0 pb-6 border-t border-gray-200 dark:border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {/* Row 1: Title & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="e.g., Present Perfect vs Past Simple"
                  className="rounded-2xl border-2 h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold">
                  Category *
                </Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(val) => handleChange("category_id", val)}
                  required
                >
                  <SelectTrigger className="rounded-2xl border-2 h-12">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <span className="flex items-center gap-2">
                          {cat.icon && <span>{cat.icon}</span>}
                          <span>{cat.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Level & Order */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level" className="text-sm font-semibold">
                  Difficulty Level *
                </Label>
                <Select
                  value={formData.difficulty_level}
                  onValueChange={(val) => handleChange("difficulty_level", val as Level)}
                  required
                >
                  <SelectTrigger className="rounded-2xl border-2 h-12">
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
                <Label htmlFor="orderIndex" className="text-sm font-semibold">
                  Order Index
                </Label>
                <Input
                  id="orderIndex"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) =>
                    handleChange("order_index", parseInt(e.target.value) || 1)
                  }
                  className="rounded-2xl border-2 h-12"
                  min="1"
                />
              </div>

              <div className="flex items-end">
                <div className="flex items-center space-x-3 p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-900/10 border-2 border-orange-100 dark:border-orange-900/30 w-full h-12">
                  <input
                    type="checkbox"
                    id="isPremium"
                    checked={formData.is_premium}
                    onChange={(e) => handleChange("is_premium", e.target.checked)}
                    className="h-5 w-5 rounded-lg border-2 border-orange-300 text-orange-500 focus:ring-orange-500"
                  />
                  <Label
                    htmlFor="isPremium"
                    className="text-sm font-semibold text-orange-700 dark:text-orange-400 cursor-pointer"
                  >
                    👑 Premium
                  </Label>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="space-y-2">
              <Label htmlFor="explanation" className="text-sm font-semibold">
                Explanation *
              </Label>
              <Textarea
                id="explanation"
                value={formData.explanation}
                onChange={(e) => handleChange("explanation", e.target.value)}
                placeholder="Explain the grammar concept in detail..."
                className="rounded-2xl border-2 resize-none"
                rows={4}
                required
              />
            </div>

            {/* Examples */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Examples *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addExample}
                  className="rounded-2xl border-2"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Example
                </Button>
              </div>
              <div className="space-y-3">
                {formData.examples.map((example, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={example}
                      onChange={(e) => handleExampleChange(index, e.target.value)}
                      placeholder={`Example ${index + 1}`}
                      className="rounded-2xl border-2"
                    />
                    {formData.examples.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExample(index)}
                        className="rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Practice Text */}
            <div className="space-y-2">
              <Label htmlFor="miniText" className="text-sm font-semibold">
                Practice Text *
              </Label>
              <Textarea
                id="miniText"
                value={formData.mini_text}
                onChange={(e) => handleChange("mini_text", e.target.value)}
                placeholder="A short text demonstrating the grammar concept..."
                className="rounded-2xl border-2 resize-none"
                rows={6}
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  handleReset();
                  onToggle();
                }}
                className="flex-1 rounded-2xl border-2 h-12"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-2xl h-12 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)]"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : mode === "create" ? "Create Topic" : "Update Topic"}
              </Button>
            </div>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
