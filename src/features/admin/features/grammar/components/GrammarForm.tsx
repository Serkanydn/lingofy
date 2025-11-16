"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { FieldArrayPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { Level } from "@/shared/types/common.types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { createGrammarTopicSchema, type CreateGrammarTopicFormData } from "../types/validation";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

interface GrammarFormProps {
  isOpen: boolean;
  onToggle: () => void;
  onSubmit: (data: GrammarFormData) => Promise<void>;
  initialData?: Partial<GrammarFormData>;
  categories?: Array<{ id: string; name: string; icon?: string }>;
  isLoading?: boolean;
  mode?: "create" | "edit";
  categoriesLoading?: boolean;
  categoriesError?: boolean;
  onCategoryChange?: (categoryId: string) => void;
}

export type GrammarFormData = CreateGrammarTopicFormData;

export function GrammarForm({
  isOpen,
  onToggle,
  onSubmit,
  initialData,
  categories = [],
  isLoading = false,
  mode = "create",
  categoriesLoading = false,
  categoriesError = false,
  onCategoryChange,
}: GrammarFormProps) {
  const form = useForm<CreateGrammarTopicFormData>({
    resolver: zodResolver(createGrammarTopicSchema),
    defaultValues: {
      title: "",
      category_id: "",
      difficulty_level: "B1",
      explanation: "",
      mini_text: "",
      examples: [""],
      order_index: 1,
      is_premium: false,
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  type ExamplesArrayName = FieldArrayPath<CreateGrammarTopicFormData>;
  const { fields, append, remove } = useFieldArray<CreateGrammarTopicFormData>({ control: form.control, name: "examples" as ExamplesArrayName });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title ?? "",
        category_id: initialData.category_id ?? "",
        difficulty_level: (initialData.difficulty_level as Level) ?? "B1",
        explanation: initialData.explanation ?? "",
        mini_text: initialData.mini_text ?? "",
        examples: initialData.examples ?? [""],
        order_index: initialData.order_index ?? 1,
        is_premium: initialData.is_premium ?? false,
      });
    }
  }, [initialData, form]);
console.log("form.getValues() :>> ", form.getValues());

  const onSubmitForm = async (data: CreateGrammarTopicFormData) => {
    try {
      await onSubmit({
        ...data,
        title: data.title.trim(),
        explanation: data.explanation.trim(),
        mini_text: data.mini_text.trim(),
        examples: Array.from(new Set(data.examples.map((ex) => ex.trim()).filter(Boolean))),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to save grammar topic";
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

      <CardContent className="pt-0 pb-6 border-t border-gray-200 dark:border-gray-800" hidden={!isOpen}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6 mt-6" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Present Perfect vs Past Simple" className="rounded-2xl border-2 h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Category *</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(val) => {
                              field.onChange(val);
                              if (onCategoryChange) onCategoryChange(val);
                            }}
                          >
                            <SelectTrigger className="rounded-2xl border-2 h-12" disabled={categoriesLoading || categoriesError || categories.length === 0}>
                              <SelectValue
                                placeholder={
                                  categoriesLoading
                                    ? "Loading categories..."
                                    : categoriesError
                                      ? "Failed to load categories"
                                      : "Select category"
                                }
                              />
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
                        </FormControl>

                        {!categoriesLoading && !categoriesError && categories.length === 0 && (
                          <div className="mt-2">
                            <Badge variant="destructive">No active categories</Badge>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="difficulty_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Difficulty Level *</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={(val) => field.onChange(val as Level)}>
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="order_index"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Order Index</FormLabel>
                        <FormControl>
                          <Input type="number" className="rounded-2xl border-2 h-12" value={Number(field.value ?? 1)} min={1} onChange={(e) => {
                            const parsed = parseInt(e.target.value || "1", 10);
                            const clamped = Number.isNaN(parsed) ? 1 : Math.max(1, parsed);
                            field.onChange(clamped);
                          }} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-end">
                  <div className="flex items-center space-x-3 p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-900/10 border-2 border-orange-100 dark:border-orange-900/30 w-full h-12">
                    <FormField
                      control={form.control}
                      name="is_premium"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <input
                              type="checkbox"
                              id="isPremium"
                              className="h-5 w-5 rounded-lg border-2 border-orange-300 text-orange-500 focus:ring-orange-500"
                              checked={!!field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          </FormControl>
                          <Label htmlFor="isPremium" className="text-sm font-semibold text-orange-700 dark:text-orange-400 cursor-pointer">👑 Premium</Label>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="explanation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Explanation *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Explain the grammar concept in detail..." className="rounded-2xl border-2 resize-none" rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Examples *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => { if (fields.length < 10) append(""); }} disabled={fields.length >= 10} className="rounded-2xl border-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Example
                  </Button>
                </div>
                <div className="space-y-3">
                  {fields.map((fieldItem, index) => (
                    <div key={fieldItem.id} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`examples.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder={`Example ${index + 1}`} className="rounded-2xl border-2" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {fields.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0">
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="mini_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Practice Text *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="A short text demonstrating the grammar concept..." className="rounded-2xl border-2 resize-none" rows={6} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset({
                      title: "",
                      category_id: "",
                      difficulty_level: "B1",
                      explanation: "",
                      mini_text: "",
                      examples: [""],
                      order_index: 1,
                      is_premium: false,
                    });
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
          </Form>
        </CardContent>
    </Card>
  );
}
