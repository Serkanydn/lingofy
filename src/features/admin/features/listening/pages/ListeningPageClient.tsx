'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { PageHeader, ContentCard, FilterBar, DataTable, DeleteConfirmDialog, type DataTableColumn } from '@/features/admin/shared/components';
import { ListeningFormData } from '../types/validation';
import { useCreateListening, useDeleteListening, useListeningContent, useUpdateListening } from '../hooks/useListeningContent';
import { ListeningForm } from '../components/ListeningForm';

export function ListeningPageClient() {
  const [showForm, setShowForm] = useState(false);
  const [editingListening, setEditingListening] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedListening, setSelectedListening] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [premiumFilter, setPremiumFilter] = useState<string>('all');
  const { data: listenings, isLoading } = useListeningContent();
  const createListening = useCreateListening();
  const updateListening = useUpdateListening();
  const deleteListening = useDeleteListening();

  const filteredListenings =
    listenings?.filter(
      (listening) =>
        listening.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (levelFilter === 'all' || listening.level === levelFilter) &&
        (premiumFilter === 'all' ||
          (premiumFilter === 'premium' && listening.is_premium) ||
          (premiumFilter === 'free' && !listening.is_premium))
    ) || [];

  const handleEdit = (listening: any) => {
    setEditingListening(listening);
    setShowForm(true);
  };

  const handleDelete = (listening: any) => {
    setSelectedListening(listening);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedListening) {
      await deleteListening.mutateAsync(selectedListening.id);
      setShowDeleteDialog(false);
      setSelectedListening(null);
    }
  };

  const handleFormSubmit = async (data: ListeningFormData) => {

    if (editingListening) {
      await updateListening.mutateAsync({
        id: editingListening.id,
        updateData: data,
      });
    } else {
      await createListening.mutateAsync(data);
    }
    setShowForm(false);
    setEditingListening(null);
  };

  const handleFormToggle = () => {
    if (showForm) {
      setEditingListening(null);
    }
    setShowForm(!showForm);
  };

  const columns: DataTableColumn<any>[] = [
    {
      header: 'Title',
      accessor: 'title',
      render: (listening) => (
        <div>
          <div className="font-medium">{listening.title}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
            {listening.description}
          </div>
        </div>
      ),
    },
    {
      header: 'Level',
      accessor: 'level',
      render: (listening) => <Badge variant="outline">{listening.level}</Badge>,
    },
    {
      header: 'Type',
      accessor: 'is_premium',
      render: (listening) =>
        listening.is_premium ? (
          <Badge className="bg-orange-500 hover:bg-orange-600">Premium</Badge>
        ) : (
          <Badge variant="secondary">Free</Badge>
        ),
    },
    {
      header: 'Created',
      accessor: 'created_at',
      render: (listening) => (
        <div className="text-sm">{new Date(listening.created_at).toLocaleDateString()}</div>
      ),
    },
    {
      header: 'Actions',
      accessor: (listening) => listening.id,
      className: 'text-right',
      render: (listening) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(listening)} className="rounded-xl">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(listening)} className="rounded-xl">
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
          icon={<span className="text-4xl">🎧</span>}
          iconBgClass="bg-linear-to-br from-purple-400 to-purple-600 shadow-[0_4px_14px_rgba(168,85,247,0.4)]"
          title="Listening Management"
          description="Manage listening exercises and audio content"
          action={
            <Button
              onClick={() => {
                setEditingListening(null);
                setShowForm(true);
              }}
              className="rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Listening
            </Button>
          }
        />

        <ListeningForm
          isOpen={showForm}
          onToggle={handleFormToggle}
          onSubmit={handleFormSubmit}
          initialData={editingListening || undefined}
          isLoading={createListening.isPending || updateListening.isPending}
          mode={editingListening ? "edit" : "create"}
        />

        <ContentCard
          title="All Listening Exercises"
          description={`Total: ${filteredListenings.length} exercises`}
          filters={
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={(value) => {
                setSearchQuery(value);
              }}
              searchPlaceholder="Search listening..."
              filters={[
                {
                  value: levelFilter,
                  onChange: (value) => {
                    setLevelFilter(value);
                  },
                  options: [
                    { value: 'all', label: 'All Levels' },
                    { value: 'A1', label: 'A1' },
                    { value: 'A2', label: 'A2' },
                    { value: 'B1', label: 'B1' },
                    { value: 'B2', label: 'B2' },
                    { value: 'C1', label: 'C1' },
                    { value: 'C2', label: 'C2' },
                  ],
                },
                {
                  value: premiumFilter,
                  onChange: (value) => {
                    setPremiumFilter(value);
                  },
                  options: [
                    { value: 'all', label: 'All Types' },
                    { value: 'premium', label: 'Premium' },
                    { value: 'free', label: 'Free' },
                  ],
                },
              ]}
            />
          }
        >
          <DataTable
            columns={columns}
            data={filteredListenings}
            keyExtractor={(listening) => listening.id}
            isLoading={isLoading}
            pagination={{
              enabled: true,
              defaultItemsPerPage: 10,
            }}
            emptyState={
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No listening exercises found</p>
              </div>
            }
          />
        </ContentCard>
      </div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedListening(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Listening Content"
        description={`Are you sure you want to delete "${selectedListening?.title}"? This action cannot be undone.`}
        isPending={deleteListening.isPending}
      />
    </div>
  );
}
