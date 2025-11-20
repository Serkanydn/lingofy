"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuestionType } from "@/shared/types/enums/question.enum";

export interface QuestionOption {
  text: string;
  is_correct: boolean;
}

export interface Question {
  id?: string;
  text: string;
  type: QuestionType;
  options: QuestionOption[];
  correct_answer?: string; // For fill_blank type
  points: number;
  order: number;
}

interface QuestionManagerProps {
  questions: Question[];
  onChange: (questions: Question[]) => void;
}

export function QuestionManager({ questions, onChange }: QuestionManagerProps) {
  const addQuestion = () => {
    const newQuestion: Question = {
      text: "",
      type: QuestionType.MULTIPLE_CHOICE,
      options: [
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
      ],
      points: 10,
      order: questions.length + 1,
    };
    onChange([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    // Reorder remaining questions
    updated.forEach((q, i) => {
      q.order = i + 1;
    });
    onChange(updated);
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };

    // If changing to true_false, reset options
    if (field === "type" && value === "true_false") {
      updated[index].options = [
        { text: "True", is_correct: false },
        { text: "False", is_correct: false },
      ];
    }
    // If changing to multiple_choice from true_false, add more options
    else if (field === "type" && value === "multiple_choice" && updated[index].options.length === 2) {
      updated[index].options = [
        ...updated[index].options,
        { text: "", is_correct: false },
        { text: "", is_correct: false },
      ];
    }
    // If changing to fill_blank, clear options
    else if (field === "type" && value === "fill_blank") {
      updated[index].options = [];
      updated[index].correct_answer = "";
    }

    onChange(updated);
  };

  const addOption = (questionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options.push({ text: "", is_correct: false });
    onChange(updated);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options = updated[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    onChange(updated);
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    field: keyof QuestionOption,
    value: any
  ) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = {
      ...updated[questionIndex].options[optionIndex],
      [field]: value,
    };

    // For multiple_choice and true_false, only one option can be correct
    if (field === "is_correct" && value === true) {
      updated[questionIndex].options.forEach((opt, i) => {
        if (i !== optionIndex) {
          opt.is_correct = false;
        }
      });
    }

    onChange(updated);
  };

  const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
      case QuestionType.MULTIPLE_CHOICE:
        return "Multiple Choice";
      case QuestionType.FILL_BLANK:
        return "Fill in the Blank";
      case QuestionType.TRUE_FALSE:
        return "True/False";
      default:
        return type;
    }
  };

  const getQuestionTypeColor = (type: QuestionType) => {
    switch (type) {
      case QuestionType.MULTIPLE_CHOICE:
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
      case QuestionType.FILL_BLANK:
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
      case QuestionType.TRUE_FALSE:
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Questions ({questions.length})
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add comprehension questions for the listening exercise
          </p>
        </div>
        <Button
          type="button"
          onClick={addQuestion}
          variant="outline"
          className="rounded-2xl border-2 border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </div>

      {questions.map((question, qIndex) => (
        <Card
          key={qIndex}
          className="rounded-3xl border-2 border-gray-200 dark:border-gray-800"
        >
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <GripVertical className="h-5 w-5 text-gray-400 mt-1 cursor-move" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className={`rounded-full border-0 ${getQuestionTypeColor(question.type)}`}>
                      {getQuestionTypeLabel(question.type)}
                    </Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Question #{qIndex + 1}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeQuestion(qIndex)}
                className="rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Question Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Question Type</Label>
                <Select
                  value={question.type}
                  onValueChange={(value) =>
                    updateQuestion(qIndex, "type", value as QuestionType)
                  }
                >
                  <SelectTrigger className="rounded-2xl border-2 border-gray-200 dark:border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                    <SelectItem value="fill_blank">Fill in the Blank</SelectItem>
                    <SelectItem value="true_false">True/False</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Points</Label>
                <Input
                  type="number"
                  value={question.points}
                  onChange={(e) =>
                    updateQuestion(qIndex, "points", parseInt(e.target.value) || 10)
                  }
                  className="rounded-2xl border-2 border-gray-200 dark:border-gray-700"
                  min="1"
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <Label>Question Text *</Label>
              <Textarea
                value={question.text}
                onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
                placeholder="Enter your question here..."
                className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500"
                rows={3}
              />
            </div>

            {/* Options for Multiple Choice and True/False */}
            {(question.type === "multiple_choice" || question.type === "true_false") && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Answer Options</Label>
                  {question.type === "multiple_choice" && (
                    <Button
                      type="button"
                      onClick={() => addOption(qIndex)}
                      variant="ghost"
                      size="sm"
                      className="rounded-xl"
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add Option
                    </Button>
                  )}
                </div>

                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-3">
                    <Checkbox
                      checked={option.is_correct}
                      onCheckedChange={(checked) =>
                        updateOption(qIndex, oIndex, "is_correct", checked)
                      }
                      className="h-5 w-5 rounded-lg border-2 border-orange-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                    />
                    <Input
                      value={option.text}
                      onChange={(e) =>
                        updateOption(qIndex, oIndex, "text", e.target.value)
                      }
                      placeholder={`Option ${oIndex + 1}`}
                      className="flex-1 rounded-2xl border-2 border-gray-200 dark:border-gray-700"
                      disabled={question.type === "true_false"}
                    />
                    {question.type === "multiple_choice" &&
                      question.options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(qIndex, oIndex)}
                          className="rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                  </div>
                ))}
              </div>
            )}

            {/* Correct Answer for Fill in the Blank */}
            {question.type === "fill_blank" && (
              <div className="space-y-2">
                <Label>Correct Answer *</Label>
                <Input
                  value={question.correct_answer || ""}
                  onChange={(e) =>
                    updateQuestion(qIndex, "correct_answer", e.target.value)
                  }
                  placeholder="Enter the correct answer..."
                  className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Students will need to type this answer exactly (case-insensitive)
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {questions.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/20 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No questions added yet
          </p>
          <Button
            type="button"
            onClick={addQuestion}
            variant="outline"
            className="rounded-2xl"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Question
          </Button>
        </div>
      )}
    </div>
  );
}
