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
import { Plus, Edit, Trash2, Lock } from "lucide-react";
import { useReadingContent, useDeleteReading } from "@/features/admin/hooks/useReadingContent";
import { AddReadingDialog } from "@/features/admin/components/AddReadingDialog";
import { EditReadingDialog } from "@/features/admin/components/EditReadingDialog";
import { DeleteConfirmDialog } from "@/features/admin/components/DeleteConfirmDialog";
import { ReadingText } from "@/features/reading/types/service.types";

export default function ReadingAdminPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedReading, setSelectedReading] = useState<ReadingText | null>(null);
  const { data: readings, isLoading } = useReadingContent();
  const deleteReading = useDeleteReading();

  const handleEdit = (reading: ReadingText) => {
    setSelectedReading(reading);
    setShowEditDialog(true);
  };

  const handleDelete = (reading: ReadingText) => {
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
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Reading Content</h1>
          <p className="text-muted-foreground">
            Manage reading texts and comprehension exercises
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Reading
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reading Content</CardTitle>
          <CardDescription>
            Total: {readings?.length || 0} texts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Word Count</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {readings?.map((reading) => (
                <TableRow key={reading.id}>
                  <TableCell className="font-medium max-w-xs">
                    {reading.title}
                  </TableCell>
                  <TableCell>
                    <Badge>{reading.level}</Badge>
                  </TableCell>
                  <TableCell>{reading.content.split(" ").length} words</TableCell>
                  <TableCell>
                    {reading.is_premium ? (
                      <Lock className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <span className="text-muted-foreground">Free</span>
                    )}
                  </TableCell>
                  <TableCell>{reading.order_index}</TableCell>
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
        </CardContent>
      </Card>

      <AddReadingDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />

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
