"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { createGrammarCategorySchema, type CreateGrammarCategoryFormData } from "../types/validation";

interface GrammarCategoryFormProps {
  isOpen: boolean;
  onToggle: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  initialData?: Partial<CategoryFormData>;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

export type CategoryFormData = CreateGrammarCategoryFormData;

export function GrammarCategoryForm({
  isOpen,
  onToggle,
  onSubmit,
  initialData,
  isLoading = false,
  mode = "create",
}: GrammarCategoryFormProps) {
  const form = useForm<CreateGrammarCategoryFormData>({
    resolver: zodResolver(createGrammarCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      icon: "📚",
      color: "#f59e0b",
      order_index: 1,
      is_active: true,
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name ?? "",
        slug: initialData.slug ?? "",
        description: initialData.description ?? "",
        icon: initialData.icon ?? "📚",
        color: initialData.color ?? "#f59e0b",
        order_index: initialData.order_index ?? 1,
        is_active: initialData.is_active ?? true,
      });
    }
  }, [initialData, form]);

  const onSubmitForm = async (data: CreateGrammarCategoryFormData) => {
    await onSubmit({
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      icon: data.icon,
      color: data.color,
      order_index: data.order_index,
      is_active: data.is_active,
    });
  };

  return (
    <Card className="mb-6 rounded-3xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300">
      <div
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(251,191,36,0.4)]">
            <span className="text-2xl">📑</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === "create" ? "Add New Category" : "Edit Category"}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Category Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Verb Tenses"
                            className="rounded-2xl border-2 h-12"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value);
                              const slug = value
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/(^-|-$)/g, "");
                              form.setValue("slug", slug, { shouldValidate: true });
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Icon (Emoji)</FormLabel>
                        <FormControl>
                          <Input placeholder="📚" className="rounded-2xl border-2 h-12 text-center text-2xl" maxLength={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Slug (URL-friendly) *</FormLabel>
                        <FormControl>
                          <Input placeholder="verb-tenses" className="rounded-2xl border-2 h-12 font-mono text-sm" {...field} />
                        </FormControl>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Auto-generated from name, but you can customize it</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Color (HEX)</FormLabel>
                        <div className="flex gap-2">
                          <Input type="color" className="rounded-2xl border-2 h-12 w-20 shrink-0" value={field.value} onChange={(e) => field.onChange(e.target.value)} />
                          <Input type="text" placeholder="#f59e0b" className="rounded-2xl border-2 h-12 font-mono text-sm flex-1" value={field.value} onChange={(e) => field.onChange(e.target.value)} />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="order_index"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Display Order</FormLabel>
                      <FormControl>
                        <Input type="number" className="rounded-2xl border-2 h-12" value={Number(field.value ?? 1)} min={1} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />
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
                      <FormLabel className="text-sm font-semibold">Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief description of this category..." className="rounded-2xl border-2 resize-none" rows={3} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center space-x-3 p-4 rounded-2xl bg-green-50/50 dark:bg-green-900/10 border-2 border-green-100 dark:border-green-900/30">
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3">
                      <FormControl>
                        <input
                          type="checkbox"
                          id="isActive"
                          className="h-5 w-5 rounded-lg border-2 border-green-300 text-green-500 focus:ring-green-500"
                          checked={!!field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      </FormControl>
                      <Label htmlFor="isActive" className="text-sm font-semibold text-green-700 dark:text-green-400 cursor-pointer">✓ Active Category</Label>
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
                      name: "",
                      slug: "",
                      description: "",
                      icon: "📚",
                      color: "#f59e0b",
                      order_index: 1,
                      is_active: true,
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
                  {isLoading ? "Saving..." : mode === "create" ? "Create Category" : "Update Category"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      )}
    </Card>
  );
}
