'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, List } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ContentCard } from '../components/ContentCard';
import { FilterBar } from '../components/FilterBar';
import { Pagination } from '../components/Pagination';
import { AddGrammarDialog } from '../components/AddGrammarDialog';
import { EditGrammarDialog } from '../components/EditGrammarDialog';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';
import { useGrammarTopics, useDeleteGrammarTopic } from '../hooks/useGrammarTopics';

export function GrammarPageClient() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [premiumFilter, setPremiumFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { data: topics, isLoading } = useGrammarTopics();
  const deleteTopic = useDeleteGrammarTopic();

  const filteredTopics =
    topics?.filter(
      (topic) =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (categoryFilter === 'all' || topic.category_id === categoryFilter) &&
        (premiumFilter === 'all' ||
          (premiumFilter === 'premium' && topic.is_premium) ||
          (premiumFilter === 'free' && !topic.is_premium))
    ) || [];

  const totalPages = Math.ceil(filteredTopics.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTopics = filteredTopics.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (topic: any) => {
    setSelectedTopic(topic);
    setShowEditDialog(true);
  };

  const handleDelete = (topic: any) => {
    setSelectedTopic(topic);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedTopic) {
      await deleteTopic.mutateAsync(selectedTopic.id);
      setShowDeleteDialog(false);
      setSelectedTopic(null);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
                onClick={() => setShowAddDialog(true)}
                className="rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Topic
              </Button>
            </div>
          }
        />

        <ContentCard
          title="All Grammar Topics"
          description={`Total: ${filteredTopics.length} topics`}
          filters={
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={(value) => {
                setSearchQuery(value);
                setCurrentPage(1);
              }}
              searchPlaceholder="Search topics..."
              filters={[
                {
                  value: categoryFilter,
                  onChange: (value) => {
                    setCategoryFilter(value);
                    setCurrentPage(1);
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
                    setCurrentPage(1);
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTopics.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell>
                    <div className="font-medium">{topic.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      {topic.mini_text || 'No description'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{topic.category_id || 'Uncategorized'}</Badge>
                  </TableCell>
                  <TableCell>
                    {topic.is_premium ? (
                      <Badge className="bg-orange-500 hover:bg-orange-600">Premium</Badge>
                    ) : (
                      <Badge variant="secondary">Free</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{new Date(topic.created_at).toLocaleDateString()}</div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(topic)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(topic)}>
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
          totalItems={filteredTopics.length}
        />
      </div>

      <AddGrammarDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} />

      <EditGrammarDialog
        open={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setSelectedTopic(null);
        }}
        topic={selectedTopic}
      />

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
