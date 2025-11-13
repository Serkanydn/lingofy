'use client';

import { useState } from "react";
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
import { useCreateCategory } from "../hooks/useWords";

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * CategoryDialog Component
 * 
 * Modal dialog for creating new category:
 * - Category name input
 * - Color picker with hex input
 * - Create/Cancel buttons
 * 
 * @component
 */
export function CategoryDialog({ open, onClose }: CategoryDialogProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const createCategory = useCreateCategory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory.mutate(
      { name, color },
      {
        onSuccess: () => {
          setName("");
          setColor("#3b82f6");
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create Category
          </DialogTitle>
          <DialogDescription className="text-base">
            Organize your words into categories
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">
              Category Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Business English, Travel"
              required
              className="rounded-2xl h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color" className="text-sm font-semibold">
              Color
            </Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-16 h-16 rounded-2xl cursor-pointer border-2 border-gray-200 dark:border-gray-700"
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="rounded-2xl h-12 text-base"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-2xl h-12 text-base border-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-2xl h-12 text-base bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-[0_4px_14px_rgba(249,115,22,0.4)]"
            >
              Create Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
