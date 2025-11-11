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
import { Plus, Edit, Trash2, Lock, Crown, FolderCog, ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [premiumFilter, setPremiumFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { data: topics, isLoading } = useGrammarTopics();
  const deleteTopic = useDeleteGrammarTopic();

  const filteredTopics = topics?.filter(
    (topic) =>
      (topic.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (categoryFilter === "all" || topic.category_id === categoryFilter) &&
      (premiumFilter === "all" ||
        (premiumFilter === "premium" && topic.is_premium) ||
        (premiumFilter === "free" && !topic.is_premium))
  );

  const totalPages = Math.ceil((filteredTopics?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTopics = filteredTopics?.slice(startIndex, endIndex);

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
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="mb-10">
          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_4px_14px_rgba(251,191,36,0.4)]">
                  <span className="text-4xl">📚</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    Grammar Topics
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage grammar lessons and topics
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href="/admin/grammar/categories">
                  <Button variant="outline" className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300">
                    <FolderCog className="mr-2 h-4 w-4" />
                    Manage Categories
                  </Button>
                </Link>
                <Button onClick={() => setShowAddDialog(true)} className="rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Topic
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Grammar Topics</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Total: {filteredTopics?.length || 0} topics
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={categoryFilter} onValueChange={(value) => { setCategoryFilter(value); setCurrentPage(1); }}>
                  <SelectTrigger className="w-40 rounded-2xl border-2 border-gray-200 dark:border-gray-700">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {topics && [...new Set(topics.map(t => t.category_id))].map(catId => {
                      const category = topics.find(t => t.category_id === catId)?.category;
                      return category ? (
                        <SelectItem key={catId} value={catId}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ) : null;
                    })}
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
                    placeholder="Search topics..."
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
                <TableHead>Category</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Examples</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTopics?.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell className="font-medium max-w-xs">
                    {topic.title}
                  </TableCell>
                  <TableCell>
                    <Badge className="rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-0">
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
                    {topic.is_premium ? (
                      <Crown className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <span className="text-muted-foreground">Free</span>
                    )}
                  </TableCell>
                  <TableCell>{topic.order_index}</TableCell>
                  <TableCell>{topic.examples?.length || 0}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(topic)} className="rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(topic)} className="rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300">
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
