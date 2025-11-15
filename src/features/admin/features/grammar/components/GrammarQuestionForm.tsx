"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { FieldArrayPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { grammarQuestionSchema, type GrammarQuestionFormData } from "../types/validation";

interface GrammarQuestionFormProps {
  isOpen: boolean;
  onToggle: () => void;
  onSubmit: (data: QuestionFormData) => Promise<void>;
  initialData?: Partial<QuestionFormData>;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

export type QuestionFormData = GrammarQuestionFormData;

export function GrammarQuestionForm({
  isOpen,
  onToggle,
  onSubmit,
  initialData,
  isLoading = false,
  mode = "create",
}: GrammarQuestionFormProps) {
  const form = useForm<GrammarQuestionFormData>({
    resolver: zodResolver(grammarQuestionSchema),
    defaultValues: {
      question: "",
      options: ["", "", "", ""],
      correct_answer: "",
      explanation: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  type OptionsArrayName = FieldArrayPath<GrammarQuestionFormData>;
  const { fields, append, remove } = useFieldArray<GrammarQuestionFormData>({
    control: form.control,
    name: "options" as OptionsArrayName,
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        question: initialData.question ?? "",
        options: initialData.options ?? ["", "", "", ""],
        correct_answer: initialData.correct_answer ?? "",
        explanation: initialData.explanation ?? "",
      });
    }
  }, [initialData, form]);

  const onSubmitForm = async (data: GrammarQuestionFormData) => {
    try {
      const filteredOptions = data.options.map((o) => o.trim()).filter(Boolean);
      const correct = data.correct_answer.trim();
      await onSubmit({
        ...data,
        options: filteredOptions,
        correct_answer: correct,
      });
    } catch (error: any) {
      const message = error?.message || "Failed to save question";
      toast.error(message);
    }
  };

  return (
    <Card className="mb-6 rounded-3xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300">
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

      {isOpen && (
        <CardContent className="pt-0 pb-6 border-t border-gray-200 dark:border-gray-800">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6 mt-6" noValidate>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Question Text *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter the question text..." className="rounded-2xl border-2 resize-none" rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Answer Options *</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Provide at least 2 options. One must be the correct answer.</p>
                <div className="space-y-3">
                  {fields.map((fieldItem, index) => (
                    <div key={fieldItem.id} className="flex gap-2 items-center">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                          {String.fromCharCode(65 + index)}
                        </span>
                      </div>
                      <FormField
                        control={form.control}
                        name={`options.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder={`Option ${String.fromCharCode(65 + index)}`} className="rounded-2xl border-2 h-12" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {fields.length > 2 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="rounded-xl shrink-0">
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => { if (fields.length < 6) append(""); }} disabled={fields.length >= 6} className="rounded-2xl">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Option
                </Button>
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="correct_answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Correct Answer *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter the exact correct answer from options above" className="rounded-2xl border-2 h-12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">💡 Must match one of the options exactly (case-sensitive)</p>
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="explanation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Explanation *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Explain why this is the correct answer and help users learn..." className="rounded-2xl border-2 resize-none" rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">Provide a clear explanation to help users understand the concept</p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset({
                      question: "",
                      options: ["", "", "", ""],
                      correct_answer: "",
                      explanation: "",
                    });
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
          </Form>
        </CardContent>
      )}
    </Card>
  );
}
