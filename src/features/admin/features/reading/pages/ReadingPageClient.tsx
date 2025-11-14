"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  PageHeader,
  ContentCard,
  FilterBar,
  DataTable,
  DeleteConfirmDialog,
  type DataTableColumn,
} from "@/features/admin/shared/components";
import { ReadingForm, type ReadingFormData } from "../components";
import { useReadingContent, useDeleteReading, useCreateReading, useUpdateReading } from "../hooks";

export function ReadingPageClient() {
  const [showForm, setShowForm] = useState(false);
  const [editingReading, setEditingReading] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedReading, setSelectedReading] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [premiumFilter, setPremiumFilter] = useState<string>("all");
  const { data: readings, isLoading } = useReadingContent();
  const createReading = useCreateReading();
  const updateReading = useUpdateReading();
  const deleteReading = useDeleteReading();

  const filteredReadings =
    readings?.filter(
      (reading) =>
        reading.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (levelFilter === "all" || reading.level === levelFilter) &&
        (premiumFilter === "all" ||
          (premiumFilter === "premium" && reading.is_premium) ||
          (premiumFilter === "free" && !reading.is_premium))
    ) || [];

  const handleEdit = (reading: any) => {
    setEditingReading(reading);
    setShowForm(true);
  };

  const handleDelete = (reading: any) => {
    setSelectedReading(reading);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedReading) {
      await deleteReading.mutateAsync(selectedReading.id);
      setShowDeleteDialog(false);
      setSelectedReading(null);
    }
  };

  const handleFormSubmit = async (data: ReadingFormData) => {
    const { questions, ...readingData } = data;
    
    if (editingReading) {
      await updateReading.mutateAsync({
        id: editingReading.id,
        data: {
          ...readingData,
          audio_url: readingData.audio_asset_id ? '' : '',
          updated_at: new Date().toISOString(),
        },
        questions,
      });
    } else {
      await createReading.mutateAsync({
        ...readingData,
        audio_url: readingData.audio_asset_id ? '' : '',
        updated_at: new Date().toISOString(),
        questions,
      });
    }
    setShowForm(false);
    setEditingReading(null);
  };

  const handleFormToggle = () => {
    if (showForm) {
      setEditingReading(null);
    }
    setShowForm(!showForm);
  };

  const columns: DataTableColumn<any>[] = [
    {
      header: 'Title',
      accessor: 'title',
      render: (reading) => (
        <div>
          <div className="font-medium">{reading.title}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
            {reading.content?.substring(0, 80)}...
          </div>
        </div>
      ),
    },
    {
      header: 'Level',
      accessor: 'level',
      render: (reading) => <Badge variant="outline">{reading.level}</Badge>,
    },
    {
      header: 'Type',
      accessor: 'is_premium',
      render: (reading) =>
        reading.is_premium ? (
          <Badge className="bg-orange-500 hover:bg-orange-600">Premium</Badge>
        ) : (
          <Badge variant="secondary">Free</Badge>
        ),
    },
    {
      header: 'Created',
      accessor: 'created_at',
      render: (reading) => (
        <div className="text-sm">
          {new Date(reading.created_at).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: (reading) => reading.id,
      className: 'text-right',
      render: (reading) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(reading)} className="rounded-xl">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(reading)} className="rounded-xl">
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <PageHeader
          icon={<span className="text-4xl">📖</span>}
          iconBgClass="bg-linear-to-br from-green-400 to-green-600 shadow-[0_4px_14px_rgba(34,197,94,0.4)]"
          title="Reading Management"
          description="Manage reading passages and comprehension content"
          action={
            <Button
              onClick={() => {
                setEditingReading(null);
                setShowForm(true);
              }}
              className="rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Reading
            </Button>
          }
        />

        <ReadingForm
          isOpen={showForm}
          onToggle={handleFormToggle}
          onSubmit={handleFormSubmit}
          initialData={editingReading || undefined}
          isLoading={createReading.isPending || updateReading.isPending}
          mode={editingReading ? "edit" : "create"}
        />

        <ContentCard
          title="All Reading Passages"
          description={`Total: ${filteredReadings.length} passages`}
          filters={
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={(value) => {
                setSearchQuery(value);
              }}
              searchPlaceholder="Search reading..."
              filters={[
                {
                  value: levelFilter,
                  onChange: (value) => {
                    setLevelFilter(value);
                  },
                  options: [
                    { value: "all", label: "All Levels" },
                    { value: "A1", label: "A1" },
                    { value: "A2", label: "A2" },
                    { value: "B1", label: "B1" },
                    { value: "B2", label: "B2" },
                    { value: "C1", label: "C1" },
                    { value: "C2", label: "C2" },
                  ],
                },
                {
                  value: premiumFilter,
                  onChange: (value) => {
                    setPremiumFilter(value);
                  },
                  options: [
                    { value: "all", label: "All Types" },
                    { value: "premium", label: "Premium" },
                    { value: "free", label: "Free" },
                  ],
                },
              ]}
            />
          }
        >
          <DataTable
            columns={columns}
            data={filteredReadings}
            keyExtractor={(reading) => reading.id}
            isLoading={isLoading}
            pagination={{
              enabled: true,
              defaultItemsPerPage: 10,
            }}
            emptyState={
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No reading passages found</p>
              </div>
            }
          />
        </ContentCard>
      </div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedReading(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Reading Content"
        description={`Are you sure you want to delete "${selectedReading?.title}"? This action cannot be undone.`}
        isPending={deleteReading.isPending}
      />
    </div>
  );
}
