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
import { Plus, Edit, Trash2, Lock, Clock, ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [premiumFilter, setPremiumFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { data: listenings, isLoading } = useListeningContent();
  const deleteListening = useDeleteListening();

  const filteredListenings = listenings?.filter(
    (listening) =>
      (listening.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (levelFilter === "all" || listening.level === levelFilter) &&
      (premiumFilter === "all" ||
        (premiumFilter === "premium" && listening.is_premium) ||
        (premiumFilter === "free" && !listening.is_premium))
  );

  const totalPages = Math.ceil((filteredListenings?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedListenings = filteredListenings?.slice(startIndex, endIndex);

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
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="mb-10">
          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-[0_4px_14px_rgba(168,85,247,0.4)]">
                  <span className="text-4xl">🎧</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    Listening Content
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage audio lessons and listening exercises
                  </p>
                </div>
              </div>
              <Button onClick={() => setShowAddDialog(true)} className="rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300">
                <Plus className="mr-2 h-4 w-4" />
                Add Listening
              </Button>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Listening Content</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Total: {filteredListenings?.length || 0} audio lessons
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={levelFilter} onValueChange={(value) => { setLevelFilter(value); setCurrentPage(1); }}>
                  <SelectTrigger className="w-40 rounded-2xl border-2 border-gray-200 dark:border-gray-700">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="A1">A1</SelectItem>
                    <SelectItem value="A2">A2</SelectItem>
                    <SelectItem value="B1">B1</SelectItem>
                    <SelectItem value="B2">B2</SelectItem>
                    <SelectItem value="C1">C1</SelectItem>
                    <SelectItem value="C2">C2</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={premiumFilter} onValueChange={(value) => { setPremiumFilter(value); setCurrentPage(1); }}>
                  <SelectTrigger className="w-40 rounded-2xl border-2 border-gray-200 dark:border-gray-700">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search listening..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="pl-10 rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
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
              {paginatedListenings?.map((listening) => (
                <TableRow key={listening.id}>
                  <TableCell className="font-medium max-w-xs">
                    {listening.title}
                  </TableCell>
                  <TableCell>
                    <Badge className="rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-0">{listening.level}</Badge>
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
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(listening)} className="rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(listening)} className="rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
          {/* Pagination */}
          <div className="p-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Show</span>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => { setItemsPerPage(Number(value)); setCurrentPage(1); }}>
                  <SelectTrigger className="w-20 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600 dark:text-gray-400">entries</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="rounded-xl"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="rounded-xl"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
