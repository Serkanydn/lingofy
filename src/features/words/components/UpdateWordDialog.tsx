"use client";

import { useState, useEffect } from "react";
import * as React from "react";
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
  useUpdateWord,
  useWordCategories,
  useAssignWordToCategory,
  UserWord,
} from "../hooks/useWords";
import { useForm, useFieldArray, type FieldArrayPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { updateWordSchema, type UpdateWordInput } from "../types/validation";

interface UpdateWordDialogProps {
  open: boolean;
  onClose: () => void;
  word: UserWord;
}

export function UpdateWordDialog({
  open,
  onClose,
  word,
}: UpdateWordDialogProps) {
  const updateWord = useUpdateWord();
  const assignToCategory = useAssignWordToCategory();
  const { data: categories } = useWordCategories();
  const form = useForm<UpdateWordInput>({
    resolver: zodResolver(updateWordSchema),
    defaultValues: {
      word: word.word,
      description: word.description,
      example_sentences: (word.example_sentences && word.example_sentences.length > 0) ? word.example_sentences : [""],
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  type EXAMPLE_SENTENCES_NAME = FieldArrayPath<UpdateWordInput>;
  const { fields, append, remove } = useFieldArray<UpdateWordInput>({ control: form.control, name: "example_sentences" as EXAMPLE_SENTENCES_NAME });
  const [categoryId, setCategoryId] = React.useState<string>(word.category_id ?? "none");

  useEffect(() => {
    if (open && word) {
      form.reset({
        word: word.word,
        description: word.description,
        example_sentences: (word.example_sentences && word.example_sentences.length > 0) ? word.example_sentences : [""],
      });
      setCategoryId(word.category_id ?? "none");
    }
  }, [open, word, form]);

  const onSubmit = async (data: UpdateWordInput) => {
    try {
      await updateWord.mutateAsync({
        id: word.id,
        updates: {
          word: data.word,
          description: data.description,
          example_sentences: data.example_sentences.filter((s) => s.trim()),
        },
      });
      const currentCategoryId = word.category_id ?? "none";
      if (categoryId !== currentCategoryId) {
        await assignToCategory.mutateAsync({
          wordId: word.id,
          categoryId: categoryId === "none" ? null : categoryId,
        });
      }
      toast.success("Word updated successfully!");
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update word";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Update Word</DialogTitle>
          <DialogDescription className="text-base">
            Update the word in your vocabulary collection
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4" noValidate>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="word"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">English Word *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., excellent" className="rounded-2xl h-12 text-base border-2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Description *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., An adjective meaning very good or of high quality" rows={3} className="rounded-2xl text-base border-2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
              <Button type="button" variant="outline" size="sm" onClick={() => append("")} className="rounded-2xl border-2">
                <Plus className="mr-1 h-3 w-3" />
                Add Example
              </Button>
            </div>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`example_sentences.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Textarea rows={2} className="rounded-2xl text-base border-2" placeholder={`Example ${index + 1}: She did an excellent job on the project.`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 h-10 w-10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-2xl h-12 text-base border-2">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 rounded-2xl h-12 text-base bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300" disabled={updateWord.isPending}>
              {updateWord.isPending ? "Updating..." : "Update Word"}
            </Button>
          </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
