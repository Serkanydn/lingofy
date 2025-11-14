'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit } from 'lucide-react';
import { PageHeader, ContentCard, FilterBar, DataTable, type DataTableColumn } from '@/features/admin/shared/components';
import { UserDetailsDialog, UserForm } from '../components';
import { useUsers, useUpdateUser } from '../hooks';
import type { User, UpdateUserFormData } from '../types';

export function UsersPageClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'premium' | 'free'>('all');
  const { data: users, isLoading } = useUsers();
  const updateUser = useUpdateUser();

  const filteredUsers =
    users?.filter(
      (user) =>
        (user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (statusFilter === 'all' ||
          (statusFilter === 'premium' && user.is_premium) ||
          (statusFilter === 'free' && !user.is_premium))
    ) || [];

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: UpdateUserFormData) => {
    if (editingUser) {
      await updateUser.mutateAsync({
        id: editingUser.id,
        data,
      });
      setShowForm(false);
      setEditingUser(null);
    }
  };

  const handleFormToggle = () => {
    if (showForm) {
      setEditingUser(null);
    }
    setShowForm(!showForm);
  };

  const columns: DataTableColumn<User>[] = [
    {
      header: 'User',
      accessor: 'full_name',
      render: (user) => (
        <div className="font-medium">{user.full_name || 'Anonymous'}</div>
      ),
    },
    {
      header: 'Email',
      accessor: 'email',
      render: (user) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
      ),
    },
    {
      header: 'Status',
      accessor: 'is_premium',
      render: (user) =>
        user.is_premium ? (
          <Badge className="bg-orange-500 hover:bg-orange-600">Premium</Badge>
        ) : (
          <Badge variant="outline">Free</Badge>
        ),
    },
    {
      header: 'Joined',
      accessor: 'created_at',
      render: (user) => (
        <div className="text-sm">
          {new Date(user.created_at).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: 'Subscription',
      accessor: 'premium_expires_at',
      render: (user) =>
        user.is_premium && user.premium_expires_at ? (
          <div className="text-sm">
            <div className="text-gray-900 dark:text-white font-medium">Active</div>
            <div className="text-gray-500 dark:text-gray-400">
              Expires: {new Date(user.premium_expires_at).toLocaleDateString()}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">No subscription</div>
        ),
    },
    {
      header: 'Actions',
      accessor: (user) => user.id,
      className: 'text-right',
      render: (user) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(user)}
            className="rounded-xl"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedUser(user);
              setShowDetailsDialog(true);
            }}
            className="rounded-xl"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <PageHeader
          icon={<span className="text-4xl">👥</span>}
          iconBgClass="bg-linear-to-br from-blue-400 to-blue-600 shadow-[0_4px_14px_rgba(59,130,246,0.4)]"
          title="Users Management"
          description="Manage all registered users and their subscriptions"
        />

        <UserForm
          isOpen={showForm}
          onToggle={handleFormToggle}
          onSubmit={handleFormSubmit}
          initialData={editingUser ? {
            full_name: editingUser.full_name || undefined,
            is_premium: editingUser.is_premium,
            premium_expires_at: editingUser.premium_expires_at,
          } : undefined}
          isLoading={updateUser.isPending}
          mode="edit"
          userEmail={editingUser?.email}
        />

        <ContentCard
          title="All Users"
          description={`Total: ${filteredUsers.length} users`}
          filters={
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              searchPlaceholder="Search users..."
              filters={[
                {
                  value: statusFilter,
                  onChange: (value: any) => {
                    setStatusFilter(value);
                  },
                  options: [
                    { value: 'all', label: 'All Status' },
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
            data={filteredUsers}
            keyExtractor={(user) => user.id}
            isLoading={isLoading}
            pagination={{
              enabled: true,
              defaultItemsPerPage: 10,
            }}
            emptyState={
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No users found</p>
              </div>
            }
          />
        </ContentCard>
      </div>

      <UserDetailsDialog
        open={showDetailsDialog}
        onClose={() => {
          setShowDetailsDialog(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </div>
  );
}
