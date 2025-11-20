"use client";

import { useEffect } from "react";
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
import { Plus, Trash2, Crown, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddWord, useWordCategories, useAssignWordToCategory } from "../hooks/useWords";
import { useAuth } from "@/shared/hooks/useAuth";
import { useForm, useFieldArray } from "react-hook-form";
import type { FieldArrayPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { addWordSchema, type AddWordInput } from "../types/validation";

interface AddWordDialogProps {
  open: boolean;
  onClose: () => void;
  initialWord?: string;
  sourceType?: "reading" | "listening";
  sourceId?: string;
  initialCategoryId?: string | null;
}

export function AddWordDialog({
  open,
  onClose,
  initialWord = "",
  sourceType,
  sourceId,
  initialCategoryId = null,
}: AddWordDialogProps) {
  const { isPremium } = useAuth();
  const addWord = useAddWord();
  const assignToCategory = useAssignWordToCategory();
  const { data: categories } = useWordCategories();
  const form = useForm<AddWordInput>({
    resolver: zodResolver(addWordSchema),
    defaultValues: {
      word: initialWord || "",
      description: "",
      example_sentences: [""],
      source_type: sourceType,
      source_id: sourceId,
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  type ExampleSentencesArrayName = FieldArrayPath<AddWordInput>;
  const { fields, append, remove } = useFieldArray<AddWordInput>({ control: form.control, name: "example_sentences" as ExampleSentencesArrayName });
  const premiumDisabled = !isPremium && !!initialWord;
  const [categoryId, setCategoryId] = React.useState<string>("none");

  useEffect(() => {
    if (open) {
      form.reset({
        word: initialWord || "",
        description: "",
        example_sentences: [""],
        source_type: sourceType,
        source_id: sourceId,
      });
      setCategoryId(initialCategoryId || "none");
    }
  }, [open, initialWord, initialCategoryId, sourceType, sourceId, form]);

  const onSubmit = async (data: AddWordInput) => {
    try {
      const newWord = await addWord.mutateAsync({
        word: data.word,
        description: data.description,
        example_sentences: data.example_sentences.filter((s) => s.trim()),
        source_type: data.source_type,
        source_id: data.source_id,
      });
      if (categoryId && categoryId !== "none") {
        await assignToCategory.mutateAsync({ wordId: newWord.id, categoryId });
      }
      toast.success("Word added to your collection!");
      form.reset();
      setCategoryId("none");
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add word";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose} >
      <DialogContent className="sm:max-w-[600px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Word</DialogTitle>
          <DialogDescription className="text-base">
            Add a new word to your personal vocabulary collection
          </DialogDescription>
        </DialogHeader>

        {!isPremium && initialWord && (
          <div className="pt-4">
            <Alert className="rounded-2xl border-2 border-orange-100 bg-linear-to-br from-orange-50 to-amber-50 shadow-[0_4px_14px_rgba(249,115,22,0.15)]">
              <Crown className="h-5 w-5 text-orange-500" />
              <AlertTitle className="text-orange-900 font-bold flex items-center gap-2">
                Premium Feature
                <Sparkles className="h-4 w-4 text-orange-500" />
              </AlertTitle>
              <AlertDescription className="text-orange-800 leading-relaxed">
                <p className="mb-2">
                  You've selected: <span className="font-semibold text-orange-900">"{initialWord}"</span>
                </p>
                <p>
                  Upgrade to Premium to save selected words and sentences to your study list.
                  Get unlimited word storage, personalized categories, and advanced learning features!
                </p>
                <div className="mt-3">
                  <a
                    href="/premium"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300 hover:from-orange-600 hover:to-orange-700"
                  >
                    <Crown className="h-4 w-4" />
                    Upgrade to Premium
                  </a>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

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
                      <Input placeholder="e.g., excellent" disabled={premiumDisabled} className="rounded-2xl h-12 text-base border-2" {...field} />
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
                      <Textarea placeholder="e.g., An adjective meaning very good or of high quality" rows={3} disabled={premiumDisabled} className="rounded-2xl text-base border-2" {...field} />
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
              <Select
                value={categoryId}
                onValueChange={setCategoryId}
                disabled={premiumDisabled}
              >
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
                <Button type="button" variant="outline" size="sm" onClick={() => append("")} className="rounded-2xl border-2" disabled={premiumDisabled}>
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
                            <Textarea rows={2} disabled={premiumDisabled} className="rounded-2xl text-base border-2" placeholder={`Example ${index + 1}: She did an excellent job on the project.`} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {fields.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={premiumDisabled} className="rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 h-10 w-10">
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
              <Button type="submit" className="flex-1 rounded-2xl h-12 text-base bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300" disabled={addWord.isPending || premiumDisabled}>
                {addWord.isPending ? "Adding..." : "Add Word"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
