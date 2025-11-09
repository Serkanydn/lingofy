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
import { Plus, Edit, Trash2, Lock, Crown, FolderCog } from "lucide-react";
import { useGrammarTopics, useDeleteGrammarTopic } from "@/features/admin/hooks/useGrammarTopics";
import { AddGrammarDialog } from "@/features/admin/components/AddGrammarDialog";
import { EditGrammarDialog } from "@/features/admin/components/EditGrammarDialog";
import { DeleteConfirmDialog } from "@/features/admin/components/DeleteConfirmDialog";
import { GrammarRule } from "@/features/grammar/types/service.types";
import Link from "next/link";

export default function GrammarAdminPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<GrammarRule | null>(null);
  const { data: topics, isLoading } = useGrammarTopics();
  const deleteTopic = useDeleteGrammarTopic();

  const handleEdit = (topic: GrammarRule) => {
    setSelectedTopic(topic);
    setShowEditDialog(true);
  };

  const handleDelete = (topic: GrammarRule) => {
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
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Grammar Topics</h1>
          <p className="text-muted-foreground">
            Manage grammar lessons and topics
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/grammar/categories">
            <Button variant="outline">
              <FolderCog className="mr-2 h-4 w-4" />
              Manage Categories
            </Button>
          </Link>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Topic
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Grammar Topics</CardTitle>
          <CardDescription>
            Total: {topics?.length || 0} topics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Examples</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics?.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell className="font-medium max-w-xs">
                    {topic.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {topic.category ? (
                        <span className="flex items-center gap-1">
                          <span>{topic.category.icon}</span>
                          <span>{topic.category.name}</span>
                        </span>
                      ) : (
                        topic.category_id
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>{topic.difficulty_level}</Badge>
                  </TableCell>
                  <TableCell>
                    {topic.is_premium ? (
                      <Crown className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <span className="text-muted-foreground">Free</span>
                    )}
                  </TableCell>
                  <TableCell>{topic.order_index}</TableCell>
                  <TableCell>{topic.examples?.length || 0}</TableCell>
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
        </CardContent>
      </Card>

      <AddGrammarDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />

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
