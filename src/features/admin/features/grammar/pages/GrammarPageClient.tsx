'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Plus, Edit, Trash2, List } from 'lucide-react';
import { PageHeader, ContentCard, FilterBar, DataTable, DeleteConfirmDialog, type DataTableColumn } from '@/features/admin/shared/components';
import { GrammarForm, type GrammarFormData } from '../components/GrammarForm';
import { useGrammarTopics, useDeleteGrammarTopic, useCreateGrammarTopic, useUpdateGrammarTopic } from '../hooks';
import { useActiveGrammarCategories } from '../hooks/useGrammarCategories';

type GrammarTopic = {
  id: string;
  title: string;
  mini_text: string | null;
  category_id: string | null;
  is_premium: boolean;
  created_at: string;
};

export function GrammarPageClient() {
  const [showForm, setShowForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState<GrammarTopic | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [premiumFilter, setPremiumFilter] = useState<string>('all');
  const { data: topics, isLoading } = useGrammarTopics();
  const { data: categories } = useActiveGrammarCategories();
  const deleteTopic = useDeleteGrammarTopic();
  const createTopic = useCreateGrammarTopic();
  const updateTopic = useUpdateGrammarTopic();

  const filteredTopics =
    topics?.filter(
      (topic) =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (categoryFilter === 'all' || topic.category_id === categoryFilter) &&
        (premiumFilter === 'all' ||
          (premiumFilter === 'premium' && topic.is_premium) ||
          (premiumFilter === 'free' && !topic.is_premium))
    ) || [];

  const handleEdit = (topic: GrammarTopic) => {
    setEditingTopic(topic);
    setShowForm(true);
    // Scroll to top to show the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (topic: GrammarTopic) => {
    setSelectedTopic(topic);
    setShowDeleteDialog(true);
  };

  const handleFormSubmit = async (data: GrammarFormData) => {
    if (editingTopic) {
      await updateTopic.mutateAsync({ id: editingTopic.id, data });
    } else {
      await createTopic.mutateAsync(data);
    }
    setShowForm(false);
    setEditingTopic(null);
  };

  const handleFormToggle = () => {
    if (showForm) {
      setEditingTopic(null);
    }
    setShowForm(!showForm);
  };

  const confirmDelete = async () => {
    if (selectedTopic) {
      await deleteTopic.mutateAsync(selectedTopic.id);
      setShowDeleteDialog(false);
      setSelectedTopic(null);
    }
  };

  const columns: DataTableColumn<GrammarTopic>[] = [
    {
      header: 'Title',
      accessor: 'title',
      render: (topic) => (
        <div>
          <div className="font-medium">{topic.title}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
            {topic.mini_text || 'No description'}
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category_id',
      render: (topic) => (
        <Badge variant="outline">{topic.category_id || 'Uncategorized'}</Badge>
      ),
    },
    {
      header: 'Type',
      accessor: 'is_premium',
      render: (topic) =>
        topic.is_premium ? (
          <Badge className="bg-orange-500 hover:bg-orange-600">Premium</Badge>
        ) : (
          <Badge variant="secondary">Free</Badge>
        ),
    },
    {
      header: 'Created',
      accessor: 'created_at',
      render: (topic) => (
        <div className="text-sm">{new Date(topic.created_at).toLocaleDateString()}</div>
      ),
    },
    {
      header: 'Actions',
      accessor: (topic) => topic.id,
      className: 'text-right space-x-2',
      render: (topic) => (
        <div className="space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(topic)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(topic)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <PageHeader
          icon={<span className="text-4xl">📚</span>}
          iconBgClass="bg-linear-to-br from-amber-400 to-amber-600 shadow-[0_4px_14px_rgba(251,191,36,0.4)]"
          title="Grammar Management"
          description="Manage grammar topics and lessons"
          action={
            <div className="flex gap-3">
              <Link href="/admin/grammar/categories">
                <Button
                  variant="outline"
                  className="rounded-2xl border-2 hover:border-amber-500 hover:text-amber-600"
                >
                  <List className="mr-2 h-4 w-4" />
                  Categories
                </Button>
              </Link>
              <Button
                onClick={() => {
                  setEditingTopic(null);
                  setShowForm(!showForm);
                }}
                className="rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300"
              >
                <Plus className="mr-2 h-4 w-4" />
                {showForm ? "Hide Form" : "Add Topic"}
              </Button>
            </div>
          }
        />

        {/* Inline Grammar Form */}
        <GrammarForm
          isOpen={showForm}
          onToggle={handleFormToggle}
          onSubmit={handleFormSubmit}
          initialData={editingTopic ? {
            ...editingTopic,
            category_id: editingTopic.category_id || "",
            mini_text: editingTopic.mini_text || "",
          } as Partial<GrammarFormData> : undefined}
          categories={categories}
          isLoading={createTopic.isPending || updateTopic.isPending}
          mode={editingTopic ? "edit" : "create"}
        />

        <ContentCard
          title="All Grammar Topics"
          description={`Total: ${filteredTopics.length} topics`}
          filters={
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={(value) => {
                setSearchQuery(value);
              }}
              searchPlaceholder="Search topics..."
              filters={[
                {
                  value: categoryFilter,
                  onChange: (value) => {
                    setCategoryFilter(value);
                  },
                  options: [
                    { value: 'all', label: 'All Categories' },
                    // Add dynamic categories here
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
            data={filteredTopics}
            keyExtractor={(topic) => topic.id}
            isLoading={isLoading}
            pagination={{
              enabled: true,
              defaultItemsPerPage: 10,
            }}
            emptyState={
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No grammar topics found</p>
              </div>
            }
          />
        </ContentCard>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedTopic(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Grammar Topic"
        description={`Are you sure you want to delete "${selectedTopic?.title}"? This action cannot be undone.`}
        isPending={deleteTopic.isPending}
      />
    </div>
  );
}
