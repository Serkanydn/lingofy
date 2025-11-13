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
import { PageHeader } from '../components/PageHeader';
import { ContentCard } from '../components/ContentCard';
import { FilterBar } from '../components/FilterBar';
import { Pagination } from '../components/Pagination';
import { AddReadingDialog } from '../components/AddReadingDialog';
import { EditReadingDialog } from '../components/EditReadingDialog';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';
import { useReadingContent, useDeleteReading } from '../hooks/useReadingContent';

export function ReadingPageClient() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedReading, setSelectedReading] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [premiumFilter, setPremiumFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { data: readings, isLoading } = useReadingContent();
  const deleteReading = useDeleteReading();

  const filteredReadings =
    readings?.filter(
      (reading) =>
        reading.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (levelFilter === 'all' || reading.level === levelFilter) &&
        (premiumFilter === 'all' ||
          (premiumFilter === 'premium' && reading.is_premium) ||
          (premiumFilter === 'free' && !reading.is_premium))
    ) || [];

  const totalPages = Math.ceil(filteredReadings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReadings = filteredReadings.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (reading: any) => {
    setSelectedReading(reading);
    setShowEditDialog(true);
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
              onClick={() => setShowAddDialog(true)}
              className="rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Reading
            </Button>
          }
        />

        <ContentCard
          title="All Reading Passages"
          description={`Total: ${filteredReadings.length} passages`}
          filters={
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={(value) => {
                setSearchQuery(value);
                setCurrentPage(1);
              }}
              searchPlaceholder="Search reading..."
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
              {paginatedReadings.map((reading) => (
                <TableRow key={reading.id}>
                  <TableCell>
                    <div className="font-medium">{reading.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      {reading.content?.substring(0, 80)}...
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{reading.level}</Badge>
                  </TableCell>
                  <TableCell>
                    {reading.is_premium ? (
                      <Badge className="bg-orange-500 hover:bg-orange-600">Premium</Badge>
                    ) : (
                      <Badge variant="secondary">Free</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{new Date(reading.created_at).toLocaleDateString()}</div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(reading)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(reading)}>
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
          totalItems={filteredReadings.length}
        />
      </div>

      <AddReadingDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} />

      <EditReadingDialog
        open={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setSelectedReading(null);
        }}
        reading={selectedReading}
      />

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
