"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { FieldArrayPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useCreateGrammarTopic } from "../hooks/useGrammarTopics";
import { useActiveGrammarCategories } from "../hooks/useGrammarCategories";
import { Level } from "@/shared/types/common.types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { createGrammarTopicSchema, type CreateGrammarTopicFormData } from "../types/validation";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

interface AddGrammarDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddGrammarDialog({ open, onClose }: AddGrammarDialogProps) {
  const form = useForm<CreateGrammarTopicFormData>({
    resolver: zodResolver(createGrammarTopicSchema),
    defaultValues: {
      title: "",
      category_id: "",
      level: "B1",
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

  const createTopic = useCreateGrammarTopic();
  const { data: categories, isLoading: categoriesLoading } = useActiveGrammarCategories();

  const handleAddExample = () => append("");
  const handleRemoveExample = (index: number) => remove(index);

  const onSubmit = async (data: CreateGrammarTopicFormData) => {
    await createTopic.mutateAsync({
      ...data,
      updated_at: new Date().toISOString(),
      content_id: crypto.randomUUID(),
    });
    form.reset();
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Present Perfect vs Past Simple" className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>Category *</FormLabel>
              <Select value={form.watch("category_id")} onValueChange={(v) => form.setValue("category_id", v)} disabled={categoriesLoading}>
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
              <FormMessage />
            </div>

            <div className="space-y-2">
              <FormLabel>Difficulty Level *</FormLabel>
              <Select value={form.watch("level") as string} onValueChange={(val) => form.setValue("level", val as Level)}>
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
              <FormMessage />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="order_index"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Index</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} className="rounded-2xl border-2 border-gray-200 dark:border-gray-700" value={field.value ?? 1} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-900/10 border-2 border-orange-100 dark:border-orange-900/30">
            <FormField
              control={form.control}
              name="is_premium"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <input type="checkbox" checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} id="isPremium" className="h-5 w-5 rounded-lg border-2 border-orange-300 text-orange-500 focus:ring-orange-500 focus:ring-2 focus:ring-offset-2" />
                    </FormControl>
                    <FormLabel htmlFor="isPremium" className="text-sm font-semibold text-orange-700 dark:text-orange-400 cursor-pointer flex items-center gap-2">
                      <span>👑</span> Premium Content
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="explanation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Explanation *</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Explain the grammar concept..." className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormLabel>Examples *</FormLabel>
            {fields.map((fieldItem, index) => (
              <div key={fieldItem.id} className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`examples.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder={`Example ${index + 1}`} className="rounded-2xl border-2 border-gray-200 dark:border-gray-700" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {fields.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveExample(index)} className="rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20">
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
            <FormField
              control={form.control}
              name="mini_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Practice Text *</FormLabel>
                  <FormControl>
                    <Textarea rows={6} placeholder="A short text demonstrating the grammar concept..." className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300" disabled={createTopic.isPending}>
              {createTopic.isPending ? "Creating..." : "Create Topic"}
            </Button>
          </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
