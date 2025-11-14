"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

interface GrammarCategoryFormProps {
  isOpen: boolean;
  onToggle: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  initialData?: Partial<CategoryFormData>;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  order_index: number;
  is_active: boolean;
}

export function GrammarCategoryForm({
  isOpen,
  onToggle,
  onSubmit,
  initialData,
  isLoading = false,
  mode = "create",
}: GrammarCategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    description: "",
    icon: "📚",
    color: "#f59e0b",
    order_index: 1,
    is_active: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (field: keyof CategoryFormData, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug from name
      if (field === "name") {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "📚",
      color: "#f59e0b",
      order_index: 1,
      is_active: true,
    });
  };

  return (
    <Card className="mb-6 rounded-3xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300">
      {/* Header - Always Visible */}
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

      {/* Form Content - Collapsible */}
      {isOpen && (
        <CardContent className="pt-0 pb-6 border-t border-gray-200 dark:border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {/* Row 1: Name & Icon */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Category Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g., Verb Tenses"
                  className="rounded-2xl border-2 h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon" className="text-sm font-semibold">
                  Icon (Emoji)
                </Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => handleChange("icon", e.target.value)}
                  placeholder="📚"
                  className="rounded-2xl border-2 h-12 text-center text-2xl"
                  maxLength={2}
                />
              </div>
            </div>

            {/* Row 2: Slug & Color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-sm font-semibold">
                  Slug (URL-friendly) *
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  placeholder="verb-tenses"
                  className="rounded-2xl border-2 h-12 font-mono text-sm"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Auto-generated from name, but you can customize it
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color" className="text-sm font-semibold">
                  Color (HEX)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => handleChange("color", e.target.value)}
                    className="rounded-2xl border-2 h-12 w-20 shrink-0"
                  />
                  <Input
                    type="text"
                    value={formData.color}
                    onChange={(e) => handleChange("color", e.target.value)}
                    placeholder="#f59e0b"
                    className="rounded-2xl border-2 h-12 font-mono text-sm flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Order */}
            <div className="space-y-2">
              <Label htmlFor="orderIndex" className="text-sm font-semibold">
                Display Order
              </Label>
              <Input
                id="orderIndex"
                type="number"
                value={formData.order_index}
                onChange={(e) =>
                  handleChange("order_index", parseInt(e.target.value) || 1)
                }
                className="rounded-2xl border-2 h-12"
                min="1"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Brief description of this category..."
                className="rounded-2xl border-2 resize-none"
                rows={3}
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-green-50/50 dark:bg-green-900/10 border-2 border-green-100 dark:border-green-900/30">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.is_active}
                onChange={(e) => handleChange("is_active", e.target.checked)}
                className="h-5 w-5 rounded-lg border-2 border-green-300 text-green-500 focus:ring-green-500"
              />
              <Label
                htmlFor="isActive"
                className="text-sm font-semibold text-green-700 dark:text-green-400 cursor-pointer"
              >
                ✓ Active Category
              </Label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  handleReset();
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
        </CardContent>
      )}
    </Card>
  );
}
