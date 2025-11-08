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
import { Plus, Edit, Trash2, Lock, Clock } from "lucide-react";
import { useListeningContent, useDeleteListening } from "@/features/admin/hooks/useListeningContent";
import { AddListeningDialog } from "@/features/admin/components/AddListeningDialog";
import { EditListeningDialog } from "@/features/admin/components/EditListeningDialog";
import { DeleteConfirmDialog } from "@/features/admin/components/DeleteConfirmDialog";
import { ListeningExercise } from "@/features/listening/types/service.types";

export default function ListeningAdminPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedListening, setSelectedListening] = useState<ListeningExercise | null>(null);
  const { data: listenings, isLoading } = useListeningContent();
  const deleteListening = useDeleteListening();

  const handleEdit = (listening: ListeningExercise) => {
    setSelectedListening(listening);
    setShowEditDialog(true);
  };

  const handleDelete = (listening: ListeningExercise) => {
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
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Listening Content</h1>
          <p className="text-muted-foreground">
            Manage audio lessons and listening exercises
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Listening
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Listening Content</CardTitle>
          <CardDescription>
            Total: {listenings?.length || 0} audio lessons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listenings?.map((listening) => (
                <TableRow key={listening.id}>
                  <TableCell className="font-medium max-w-xs">
                    {listening.title}
                  </TableCell>
                  <TableCell>
                    <Badge>{listening.level}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {Math.floor(listening.duration_seconds / 60)}:
                      {String(listening.duration_seconds % 60).padStart(2, "0")}
                    </div>
                  </TableCell>
                  <TableCell>
                    {listening.is_premium ? (
                      <Lock className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <span className="text-muted-foreground">Free</span>
                    )}
                  </TableCell>
                  <TableCell>{listening.order_index}</TableCell>
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
        </CardContent>
      </Card>

      <AddListeningDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />

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
