"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateCategory, type WordCategory } from "../hooks/useWords";
import { toast } from "sonner";

interface EditCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  category: WordCategory | null;
}

export function EditCategoryDialog({ open, onClose, category }: EditCategoryDialogProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const updateCategory = useUpdateCategory();

  useEffect(() => {
    if (open && category) {
      setName(category.name);
      setColor(category.color || "#3b82f6");
    }
  }, [open, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;
    if (!name.trim()) return;
    const isHex = /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);
    if (!isHex) {
      toast.error("Invalid color format. Use hex like #3b82f6");
      return;
    }
    try {
      await updateCategory.mutateAsync({ id: category.id, updates: { name, color } });
      toast.success("Category updated");
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update category";
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Category</DialogTitle>
          <DialogDescription className="text-base">Update category details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="rounded-2xl h-12 text-base border-2" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color" className="text-sm font-semibold">Color</Label>
            <div className="flex items-center gap-3">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-12 rounded-xl border-2" />
              <Input id="color" value={color} onChange={(e) => setColor(e.target.value)} required className="rounded-2xl h-12 text-base border-2" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-2xl h-12 text-base border-2">Cancel</Button>
            <Button type="submit" className="flex-1 rounded-2xl h-12 text-base bg-linear-to-r from-orange-500 to-orange-600" disabled={updateCategory.isPending}>Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}