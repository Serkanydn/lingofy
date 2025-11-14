"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";

interface GrammarQuestionFormProps {
  isOpen: boolean;
  onToggle: () => void;
  onSubmit: (data: QuestionFormData) => Promise<void>;
  initialData?: Partial<QuestionFormData>;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

export interface QuestionFormData {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export function GrammarQuestionForm({
  isOpen,
  onToggle,
  onSubmit,
  initialData,
  isLoading = false,
  mode = "create",
}: GrammarQuestionFormProps) {
  const [formData, setFormData] = useState<QuestionFormData>({
    question: "",
    options: ["", "", "", ""],
    correct_answer: "",
    explanation: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (field: keyof QuestionFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    handleChange("options", newOptions);
  };

  const handleAddOption = () => {
    handleChange("options", [...formData.options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      handleChange("options", newOptions);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filteredOptions = formData.options.filter((opt) => opt.trim() !== "");

    if (filteredOptions.length < 2) {
      alert("Please provide at least 2 options");
      return;
    }

    if (!filteredOptions.includes(formData.correct_answer)) {
      alert("Correct answer must be one of the options");
      return;
    }

    await onSubmit({
      ...formData,
      options: filteredOptions,
    });
  };

  const handleReset = () => {
    setFormData({
      question: "",
      options: ["", "", "", ""],
      correct_answer: "",
      explanation: "",
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
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(168,85,247,0.4)]">
            <span className="text-2xl">❓</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === "create" ? "Add New Question" : "Edit Question"}
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
            {/* Question Text */}
            <div className="space-y-2">
              <Label htmlFor="question" className="text-sm font-semibold">
                Question Text *
              </Label>
              <Textarea
                id="question"
                value={formData.question}
                onChange={(e) => handleChange("question", e.target.value)}
                placeholder="Enter the question text..."
                className="rounded-2xl border-2 resize-none"
                rows={3}
                required
              />
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Answer Options *</Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Provide at least 2 options. One must be the correct answer.
              </p>
              
              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                        {String.fromCharCode(65 + index)}
                      </span>
                    </div>
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      className="rounded-2xl border-2 h-12 flex-1"
                    />
                    {formData.options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveOption(index)}
                        className="rounded-xl shrink-0"
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                className="rounded-2xl"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Option
              </Button>
            </div>

            {/* Correct Answer */}
            <div className="space-y-2">
              <Label htmlFor="correctAnswer" className="text-sm font-semibold">
                Correct Answer *
              </Label>
              <Input
                id="correctAnswer"
                value={formData.correct_answer}
                onChange={(e) => handleChange("correct_answer", e.target.value)}
                placeholder="Enter the exact correct answer from options above"
                className="rounded-2xl border-2 h-12"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 Must match one of the options exactly (case-sensitive)
              </p>
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
                placeholder="Explain why this is the correct answer and help users learn..."
                className="rounded-2xl border-2 resize-none"
                rows={4}
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Provide a clear explanation to help users understand the concept
              </p>
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
                className="flex-1 rounded-2xl h-12 bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-[0_4px_14px_rgba(168,85,247,0.4)]"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : mode === "create" ? "Create Question" : "Update Question"}
              </Button>
            </div>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
