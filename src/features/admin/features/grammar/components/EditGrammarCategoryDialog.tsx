"use client";

import { useEffect } from "react";
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
import { useUpdateGrammarCategory } from "../hooks/useGrammarCategories";
import { GrammarCategory } from "@/features/grammar/types/category.types";
import { updateGrammarCategorySchema, type UpdateGrammarCategoryFormData } from "../types/validation";

interface EditGrammarCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  category: GrammarCategory | null;
}

export function EditGrammarCategoryDialog({ open, onClose, category }: EditGrammarCategoryDialogProps) {
  const updateCategory = useUpdateGrammarCategory();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateGrammarCategoryFormData>({
    resolver: zodResolver(updateGrammarCategorySchema),
  });

  useEffect(() => {
    if (category && open) {
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        color: category.color,
        order_index: category.order_index,
        is_active: category.is_active,
      });
    }
  }, [category, open, reset]);

  const onSubmit = async (data: UpdateGrammarCategoryFormData) => {
    if (!category) return;

    await updateCategory.mutateAsync({
      id: category.id,
      data: {
        ...data,
        description: data.description || null,
      },
    });

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
            Edit Grammar Category
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-gray-400">
            Update the grammar category details
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
                {...register("name")}
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
                Icon (Emoji)
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
                  type="color"
                  {...register("color")}
                  className="w-20 rounded-2xl border-2 border-gray-200 dark:border-gray-700"
                />
                <Input
                  {...register("color")}
                  placeholder="#3b82f6"
                  className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300"
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
            <Label htmlFor="isActive" className="text-sm font-semibold text-blue-700 dark:text-blue-400 cursor-pointer flex items-center gap-2">
              <span>✓</span> Active Category
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
              disabled={isSubmitting || updateCategory.isPending}
              className="flex-1 rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300"
            >
              {isSubmitting || updateCategory.isPending ? "Updating..." : "Update Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
