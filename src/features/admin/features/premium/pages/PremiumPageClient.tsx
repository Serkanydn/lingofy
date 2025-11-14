/**
 * Premium Subscriptions Page Client - Admin
 * Following: docs/03-code-standards/02-component-architecture.md
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, X } from "lucide-react";
import {
  PageHeader,
  ContentCard,
  FilterBar,
  DataTable,
  type DataTableColumn,
} from "@/features/admin/shared/components";
import {
  SubscriptionDetailsDialog,
  UpdateSubscriptionForm,
  CreateSubscriptionForm,
} from "../components";
import {
  usePremiumSubscriptions,
  usePremiumStats,
  useUpdateSubscription,
  useCancelSubscription,
} from "../hooks";
import type { PremiumSubscription } from "../types";

export function PremiumPageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubscription, setSelectedSubscription] =
    useState<PremiumSubscription | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "expired" | "none"
  >("all");

  const { data: subscriptions, isLoading } = usePremiumSubscriptions();
  const { data: stats } = usePremiumStats();
  const updateSubscription = useUpdateSubscription();
  const cancelSubscription = useCancelSubscription();

  const filteredSubscriptions =
    subscriptions?.filter(
      (sub) =>
        (sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (statusFilter === "all" || sub.subscription_status === statusFilter)
    ) || [];

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleViewDetails = (subscription: PremiumSubscription) => {
    setSelectedSubscription(subscription);
    setShowDetailsDialog(true);
  };

  const handleEdit = (subscription: PremiumSubscription) => {
    setSelectedSubscription(subscription);
    setShowUpdateForm(true);
    setShowCreateForm(false); // Close create form when update opens
  };

  const handleUpdateSubmit = async (data: {
    is_premium: boolean;
    premium_expires_at: string | null;
  }) => {
    if (selectedSubscription) {
      await updateSubscription.mutateAsync({
        userId: selectedSubscription.user_id,
        data,
      });
      setShowUpdateForm(false);
      setSelectedSubscription(null);
    }
  };

  const handleCancelSubscription = async (userId: string) => {
    await cancelSubscription.mutateAsync(userId);
    setSelectedSubscription(null);
  };

  const handleCreateSubmit = async (data: {
    email: string;
    full_name: string;
    is_premium: boolean;
    premium_expires_at: string | null;
  }) => {
    // TODO: Implement user creation with subscription
    console.log("Create user with data:", data);
    // This would call a new service method to create user
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
        );
      case "expired":
        return <Badge className="bg-red-500 hover:bg-red-600">Expired</Badge>;
      case "cancelled":
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600">Cancelled</Badge>
        );
      default:
        return <Badge variant="outline">No Subscription</Badge>;
    }
  };

  const columns: DataTableColumn<PremiumSubscription>[] = [
    {
      header: "User",
      accessor: "full_name",
      render: (subscription) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {subscription.full_name || "Anonymous"}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {subscription.email}
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "subscription_status",
      render: (subscription) =>
        getStatusBadge(subscription.subscription_status),
    },
    {
      header: "Premium",
      accessor: "is_premium",
      render: (subscription) =>
        subscription.is_premium ? (
          <Badge className="bg-orange-500 hover:bg-orange-600">Premium</Badge>
        ) : (
          <Badge variant="outline">Free</Badge>
        ),
    },
    {
      header: "Expires At",
      accessor: "premium_expires_at",
      render: (subscription) =>
        subscription.premium_expires_at ? (
          <div className="text-sm">
            {new Date(subscription.premium_expires_at).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              }
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
        ),
    },
    {
      header: "Joined",
      accessor: "created_at",
      render: (subscription) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(subscription.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: (subscription) => subscription.id,
      className: "text-right",
      render: (subscription) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(subscription)}
            className="rounded-xl"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetails(subscription)}
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
          icon={<span className="text-4xl">👑</span>}
          iconBgClass="bg-linear-to-br from-orange-400 to-orange-600 shadow-[0_4px_14px_rgba(249,115,22,0.4)]"
          title="Premium Subscriptions"
          description="Manage premium users and their subscriptions"
          action={
            <Button
              onClick={() => {
                setShowCreateForm(true);
                setShowUpdateForm(false);
              }}
              className="rounded-2xl h-12 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)]"
            >
              Add New Subscription
            </Button>
          }
        />

        {/* Create New Subscription Form */}
        {!showUpdateForm && (
          <CreateSubscriptionForm
            isOpen={showCreateForm}
            onToggle={() => {
              setShowCreateForm(!showCreateForm);
              if (!showCreateForm) {
                setShowUpdateForm(false); // Close update form when create opens
              }
            }}
            onSubmit={handleCreateSubmit}
            isLoading={false}
          />
        )}

        {/* Update Subscription Form */}
        {showUpdateForm && (
          <UpdateSubscriptionForm
            isOpen={showUpdateForm}
            onToggle={() => {
              setShowUpdateForm(!showUpdateForm);
              if (!showUpdateForm) {
                setShowCreateForm(false); // Close create form when update opens
              }
            }}
            subscription={selectedSubscription}
            onSubmit={handleUpdateSubmit}
            onCancel={handleCancelSubscription}
            isLoading={
              updateSubscription.isPending || cancelSubscription.isPending
            }
          />
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Subscribers
                </p>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalSubscribers}
              </h3>
            </div>

            <div className="bg-linear-to-br from-green-500 to-green-600 rounded-3xl shadow-[0_8px_30px_rgba(34,197,94,0.4)] p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <p className="text-sm font-medium text-green-100">Active</p>
              </div>
              <h3 className="text-3xl font-bold text-white">
                {stats.activeSubscribers}
              </h3>
            </div>

            <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <span className="text-2xl">⏰</span>
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Expired
                </p>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.expiredSubscribers}
              </h3>
            </div>

            <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-3xl shadow-[0_8px_30px_rgba(249,115,22,0.4)] p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <p className="text-sm font-medium text-orange-100">
                  Conversion Rate
                </p>
              </div>
              <h3 className="text-3xl font-bold text-white">
                {stats.totalSubscribers > 0
                  ? Math.round(
                      (stats.activeSubscribers / stats.totalSubscribers) * 100
                    )
                  : 0}
                %
              </h3>
            </div>
          </div>
        )}

        {/* Subscriptions Table */}
        <ContentCard
          title="All Subscriptions"
          description={`Total: ${filteredSubscriptions.length} subscriptions`}
          filters={
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              searchPlaceholder="Search by email or name..."
              filters={[
                {
                  value: statusFilter,
                  onChange: (value: any) => {
                    setStatusFilter(value);
                  },
                  options: [
                    { value: "all", label: "All Status" },
                    { value: "active", label: "Active" },
                    { value: "expired", label: "Expired" },
                    { value: "none", label: "No Subscription" },
                  ],
                },
              ]}
            />
          }
        >
          <DataTable
            columns={columns}
            data={filteredSubscriptions}
            keyExtractor={(subscription) => subscription.id}
            isLoading={isLoading}
            pagination={{
              enabled: true,
              defaultItemsPerPage: 10,
            }}
            emptyState={
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No subscriptions found
                </p>
              </div>
            }
          />
        </ContentCard>
      </div>

      {/* Dialogs */}
      <SubscriptionDetailsDialog
        open={showDetailsDialog}
        onClose={() => {
          setShowDetailsDialog(false);
          setSelectedSubscription(null);
        }}
        subscription={selectedSubscription}
      />
    </div>
  );
}
