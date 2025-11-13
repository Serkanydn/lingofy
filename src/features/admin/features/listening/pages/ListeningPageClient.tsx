'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { PageHeader, ContentCard, FilterBar, Pagination, DeleteConfirmDialog } from '@/features/admin/shared/components';
import { AddListeningDialog, EditListeningDialog } from '../components';
import { useListeningContent, useDeleteListening } from '../hooks';

export function ListeningPageClient() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedListening, setSelectedListening] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [premiumFilter, setPremiumFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { data: listenings, isLoading } = useListeningContent();
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

  const totalPages = Math.ceil(filteredListenings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedListenings = filteredListenings.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (listening: any) => {
    setSelectedListening(listening);
    setShowEditDialog(true);
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
              onClick={() => setShowAddDialog(true)}
              className="rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Listening
            </Button>
          }
        />

        <ContentCard
          title="All Listening Exercises"
          description={`Total: ${filteredListenings.length} exercises`}
          filters={
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={(value) => {
                setSearchQuery(value);
                setCurrentPage(1);
              }}
              searchPlaceholder="Search listening..."
              filters={[
                {
                  value: levelFilter,
                  onChange: (value) => {
                    setLevelFilter(value);
                    setCurrentPage(1);
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
                <TableHead>Level</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedListenings.map((listening) => (
                <TableRow key={listening.id}>
                  <TableCell>
                    <div className="font-medium">{listening.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      {listening.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{listening.level}</Badge>
                  </TableCell>
                  <TableCell>
                    {listening.is_premium ? (
                      <Badge className="bg-orange-500 hover:bg-orange-600">Premium</Badge>
                    ) : (
                      <Badge variant="secondary">Free</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{new Date(listening.created_at).toLocaleDateString()}</div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(listening)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(listening)}>
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
          totalItems={filteredListenings.length}
        />
      </div>

      <AddListeningDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} />

      <EditListeningDialog
        open={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setSelectedListening(null);
        }}
        listening={selectedListening}
      />

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
