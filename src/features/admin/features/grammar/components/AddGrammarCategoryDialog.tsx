"use client";

import { useForm } from "react-hook-form";
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
import { useCreateGrammarCategory } from "../hooks";
import { createGrammarCategorySchema, type CreateGrammarCategoryFormData } from "../types/validation";

interface AddGrammarCategoryDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddGrammarCategoryDialog({ open, onClose }: AddGrammarCategoryDialogProps) {
  const createCategory = useCreateGrammarCategory();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<CreateGrammarCategoryFormData>({
    resolver: zodResolver(createGrammarCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: null,
      icon: "📚",
      color: "#3b82f6",
      order_index: 0,
      is_active: true,
    },
  });

  const name = watch("name");
  const slug = watch("slug");

  const handleSlugify = (value: string) => {
    const slugified = value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slugified;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("name", value);
    if (!slug) {
      setValue("slug", handleSlugify(value));
    }
  };

  const onSubmit = async (data: CreateGrammarCategoryFormData) => {
    await createCategory.mutateAsync({
      ...data,
      description: data.description || null,
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border-0">
        <DialogHeader className="space-y-4 pb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center shadow-[0_4px_14px_rgba(59,130,246,0.4)]">
            <span className="text-4xl">📁</span>
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Add Grammar Category
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-gray-400">
            Create a new grammar category to organize topics
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Category Name *
              </Label>
              <Input
                id="name"
                {...register("name", {
                  onChange: handleNameChange,
                })}
                placeholder="e.g., Tenses"
                className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Slug *
              </Label>
              <Input
                id="slug"
                {...register("slug")}
                placeholder="e.g., tenses"
                className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300"
              />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Icon
              </Label>
              <Input
                id="icon"
                {...register("icon")}
                placeholder="📚"
                maxLength={2}
                className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300"
              />
              {errors.icon && (
                <p className="text-sm text-red-500">{errors.icon.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="color" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Color
              </Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="text"
                  {...register("color")}
                  placeholder="#3b82f6"
                  className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300"
                />
                <Input
                  type="color"
                  {...register("color")}
                  className="h-10 w-20 rounded-2xl border-2 border-gray-200 dark:border-gray-700 cursor-pointer"
                />
              </div>
              {errors.color && (
                <p className="text-sm text-red-500">{errors.color.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderIndex" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Order Index
              </Label>
              <Input
                id="orderIndex"
                type="number"
                {...register("order_index", { valueAsNumber: true })}
                min="0"
                className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300"
              />
              {errors.order_index && (
                <p className="text-sm text-red-500">{errors.order_index.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Brief description of this category..."
              rows={3}
              className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-3 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border-2 border-blue-100 dark:border-blue-900/30">
            <input
              type="checkbox"
              id="isActive"
              {...register("is_active")}
              className="h-5 w-5 rounded-lg border-2 border-blue-300 text-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
            />
            <Label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
              Active (visible to users)
            </Label>
          </div>

          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || createCategory.isPending}
              className="flex-1 rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300"
            >
              {isSubmitting || createCategory.isPending ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
