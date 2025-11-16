'use client';

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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { updateCategorySchema, type UpdateCategoryInput } from "../types/validation";

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
  const createCategory = useCreateCategory();
  const form = useForm<UpdateCategoryInput>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: { name: "", color: "#3b82f6" },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              createCategory.mutate(data, {
                onSuccess: () => {
                  form.reset({ name: "", color: "#3b82f6" });
                  onClose();
                },
              });
            })}
            className="space-y-6 pt-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Business English, Travel" className="rounded-2xl h-12 text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormLabel className="text-sm font-semibold">Color</FormLabel>
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <input type="color" value={field.value || "#3b82f6"} onChange={(e) => field.onChange(e.target.value)} className="w-16 h-16 rounded-2xl cursor-pointer border-2 border-gray-200 dark:border-gray-700" />
                    </FormControl>
                    <FormControl>
                      <Input value={field.value || ""} onChange={field.onChange} className="rounded-2xl h-12 text-base" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-2xl h-12 text-base border-2">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 rounded-2xl h-12 text-base bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-[0_4px_14px_rgba(249,115,22,0.4)]" disabled={createCategory.isPending || form.formState.isSubmitting}>
                Create Category
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
