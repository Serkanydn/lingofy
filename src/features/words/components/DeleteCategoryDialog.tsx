"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type WordCategory, useDeleteCategory, useDeleteCategoryCascade } from "../hooks/useWords";
import { toast } from "sonner";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface DeleteCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  category: WordCategory | null;
  onDeleted?: () => void;
}

export function DeleteCategoryDialog({ open, onClose, category, onDeleted }: DeleteCategoryDialogProps) {
  const deleteCategory = useDeleteCategory();
  const deleteCategoryCascade = useDeleteCategoryCascade();
  const [deleteWords, setDeleteWords] = useState(true);

  const handleDelete = async () => {
    if (!category) return;
    try {
      if (deleteWords) {
        await deleteCategoryCascade.mutateAsync(category.id);
      } else {
        await deleteCategory.mutateAsync(category.id);
      }
      toast.success("Category deleted");
      onDeleted?.();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete category";
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Delete Category</DialogTitle>
          <DialogDescription className="text-base">This action cannot be undone</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category?.color || "#ccc" }} />
            <div className="text-sm">{category?.name}</div>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox checked={deleteWords} onCheckedChange={(v) => setDeleteWords(!!v)} />
            <div className="text-sm">Also delete all words in this category</div>
          </div>
          {!deleteWords && (
            <div className="text-sm text-gray-600 dark:text-gray-400">Words in this category will remain, but without a category.</div>
          )}
        </div>
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-2xl h-12 text-base border-2">Cancel</Button>
          <Button type="button" onClick={handleDelete} className="flex-1 rounded-2xl h-12 text-base bg-destructive text-destructive-foreground" disabled={deleteCategory.isPending || deleteCategoryCascade.isPending}>Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}