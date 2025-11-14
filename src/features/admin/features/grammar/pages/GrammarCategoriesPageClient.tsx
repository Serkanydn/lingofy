"use client";

import { useState } from "react";
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
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  ToggleRight,
  ToggleLeft,
} from "lucide-react";
import {
  PageHeader,
  ContentCard,
  FilterBar,
  Pagination,
  DeleteConfirmDialog,
} from "@/features/admin/shared/components";
import { GrammarCategoryForm, type CategoryFormData } from "../components/GrammarCategoryForm";
import {
  useGrammarCategories,
  useDeleteGrammarCategory,
  useToggleGrammarCategory,
  useCreateGrammarCategory,
  useUpdateGrammarCategory,
} from "../hooks/useGrammarCategories";

export function GrammarCategoriesPageClient() {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: categories, isLoading } = useGrammarCategories();
  const createCategory = useCreateGrammarCategory();
  const updateCategory = useUpdateGrammarCategory();
  const deleteCategory = useDeleteGrammarCategory();
  const toggleCategory = useToggleGrammarCategory();

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = (category: any) => {
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

  const handleToggleActive = async (category: any) => {
    await toggleCategory.mutateAsync({
      id: category.id,
      isActive: !category.is_active,
    });
  };

  const handleFormSubmit = async (data: CategoryFormData) => {
    if (editingCategory) {
      await updateCategory.mutateAsync({
        id: editingCategory.id,
        data: data,
      });
    } else {
      await createCategory.mutateAsync(data);
    }
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleFormToggle = () => {
    if (showForm) {
      setEditingCategory(null);
    }
    setShowForm(!showForm);
  };

  const filteredCategories =
    categories?.filter(
      (category) =>
        (category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.slug.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (statusFilter === "all" ||
          (statusFilter === "active" && category.is_active) ||
          (statusFilter === "inactive" && !category.is_active))
    ) || [];

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <PageHeader
          icon={<span className="text-4xl">📑</span>}
          iconBgClass="bg-linear-to-br from-amber-400 to-amber-600 shadow-[0_4px_14px_rgba(251,191,36,0.4)]"
          title="Grammar Categories"
          description="Manage grammar topic categories"
          action={
            <Button
              onClick={() => {
                setEditingCategory(null);
                setShowForm(true);
              }}
              className="rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          }
        />

        <GrammarCategoryForm
          isOpen={showForm}
          onToggle={handleFormToggle}
          onSubmit={handleFormSubmit}
          initialData={editingCategory || undefined}
          isLoading={createCategory.isPending || updateCategory.isPending}
          mode={editingCategory ? "edit" : "create"}
        />

        <ContentCard
          title="All Categories"
          description={`Total: ${filteredCategories.length} categories`}
          filters={
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              searchPlaceholder="Search categories..."
              filters={[
                {
                  value: statusFilter,
                  onChange: (value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                  },
                  options: [
                    { value: "all", label: "All Status" },
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ],
                },
              ]}
            />
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <span className="text-lg">📚</span>
                      </div>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        {category.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                            {category.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {category.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{category.order_index}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(category)}
                      className="gap-2"
                    >
                      {category.is_active ? (
                        <>
                          <ToggleRight className="h-5 w-5 text-green-600" />
                          <span className="text-green-600 font-medium">
                            Active
                          </span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-400 font-medium">
                            Inactive
                          </span>
                        </>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(category.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ContentCard>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1);
          }}
          totalItems={filteredCategories.length}
        />
      </div>

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
