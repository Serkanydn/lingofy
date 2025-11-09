"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import {
  useGrammarCategories,
  useDeleteGrammarCategory,
  useToggleGrammarCategory,
} from "@/features/admin/hooks/useGrammarCategories";
import { AddGrammarCategoryDialog } from "@/features/admin/components/AddGrammarCategoryDialog";
import { EditGrammarCategoryDialog } from "@/features/admin/components/EditGrammarCategoryDialog";
import { DeleteConfirmDialog } from "@/features/admin/components/DeleteConfirmDialog";
import { GrammarCategory } from "@/features/grammar/types/category.types";

export default function GrammarCategoriesPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<GrammarCategory | null>(null);
  
  const { data: categories, isLoading } = useGrammarCategories();
  const deleteCategory = useDeleteGrammarCategory();
  const toggleCategory = useToggleGrammarCategory();

  const handleEdit = (category: GrammarCategory) => {
    setSelectedCategory(category);
    setShowEditDialog(true);
  };

  const handleDelete = (category: GrammarCategory) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedCategory) {
      await deleteCategory.mutateAsync(selectedCategory.id);
      setShowDeleteDialog(false);
      setSelectedCategory(null);
    }
  };

  const handleToggleActive = async (category: GrammarCategory) => {
    await toggleCategory.mutateAsync({
      id: category.id,
      isActive: !category.is_active,
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Grammar Categories</h1>
          <p className="text-muted-foreground">
            Manage grammar categories to organize topics
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>
            Total: {categories?.length || 0} categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <span className="text-2xl">{category.icon}</span>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{category.slug}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {category.description || "—"}
                  </TableCell>
                  <TableCell>{category.order_index}</TableCell>
                  <TableCell>
                    <Badge variant={category.is_active ? "default" : "secondary"}>
                      {category.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(category)}
                      title={category.is_active ? "Deactivate" : "Activate"}
                    >
                      {category.is_active ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(category)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddGrammarCategoryDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />

      <EditGrammarCategoryDialog
        open={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
      />

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedCategory(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Grammar Category"
        description={`Are you sure you want to delete "${selectedCategory?.name}"? All grammar topics in this category will also be affected.`}
        isPending={deleteCategory.isPending}
      />
    </div>
  );
}
