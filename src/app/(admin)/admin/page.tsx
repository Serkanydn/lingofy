"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  Headphones,
  BookText,
  Crown,
  TrendingUp,
} from "lucide-react";
import { useAdminStats } from "@/features/admin/hooks/useAdminStats";
import { StatsCard } from "@/features/admin/components/StatsCard";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your learning platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          description="Registered users"
        />
        <StatsCard
          title="Premium Users"
          value={stats?.premiumUsers || 0}
          icon={Crown}
          description="Active subscriptions"
          trend={`${Math.round(((stats?.premiumUsers || 0) / (stats?.totalUsers || 1)) * 100)}%`}
        />
        <StatsCard
          title="Reading Content"
          value={stats?.readingContent || 0}
          icon={BookOpen}
          description="Published texts"
        />
        <StatsCard
          title="Listening Content"
          value={stats?.listeningContent || 0}
          icon={Headphones}
          description="Audio lessons"
        />
        <StatsCard
          title="Grammar Topics"
          value={stats?.grammarTopics || 0}
          icon={BookText}
          description="Grammar lessons"
        />
        <StatsCard
          title="Total Quizzes Taken"
          value={stats?.totalQuizzes || 0}
          icon={TrendingUp}
          description="All time"
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Activity tracking coming soon...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
