'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { PageHeader, ContentCard, FilterBar, Pagination, DataTable, type DataTableColumn } from '@/features/admin/shared/components';
import { UserDetailsDialog } from '../components';
import { useUsers } from '../hooks';

type User = {
  id: string;
  email: string;
  full_name: string | null;
  is_premium: boolean;
  premium_expires_at: string | null;
  created_at: string;
  lemon_squeezy_customer_id: string | null;
  lemon_squeezy_subscription_id: string | null;
};

export function UsersPageClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'premium' | 'free'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { data: users, isLoading } = useUsers();

  const filteredUsers =
    users?.filter(
      (user) =>
        (user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (statusFilter === 'all' ||
          (statusFilter === 'premium' && user.is_premium) ||
          (statusFilter === 'free' && !user.is_premium))
    ) || [];

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
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
                    setCurrentPage(1);
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
            data={paginatedUsers}
            keyExtractor={(user) => user.id}
            isLoading={isLoading}
            emptyState={
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No users found</p>
              </div>
            }
          />
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
          totalItems={filteredUsers.length}
        />
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
