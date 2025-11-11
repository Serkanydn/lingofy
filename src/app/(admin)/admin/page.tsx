"use client";

import { useAdminStats } from "@/features/admin/hooks/useAdminStats";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-background dark:to-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="animate-pulse space-y-6">
            <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const premiumPercentage = Math.round(
    ((stats?.premiumUsers || 0) / (stats?.totalUsers || 1)) * 100
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-background dark:to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
   

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-6 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_rgb(0,0,0,0.4)] transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.1)]">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                Total Users
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                {stats?.totalUsers || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Registered users
              </p>
            </div>
          </div>

          {/* Premium Users Card */}
          <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-3xl shadow-[0_8px_30px_rgba(249,115,22,0.4)] hover:shadow-[0_12px_40px_rgba(249,115,22,0.5)] transition-all duration-300 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.2)]">
                <span className="text-2xl">👑</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                <p className="text-sm font-bold text-white">{premiumPercentage}%</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-orange-100 uppercase tracking-wide mb-2">
                Premium Users
              </p>
              <p className="text-4xl font-bold text-white mb-1">
                {stats?.premiumUsers || 0}
              </p>
              <p className="text-sm text-orange-100">
                Active subscriptions
              </p>
            </div>
          </div>

          {/* Reading Content Card */}
          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-6 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_rgb(0,0,0,0.4)] transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.1)]">
                <span className="text-2xl">📖</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                Reading Content
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                {stats?.readingContent || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Published texts
              </p>
            </div>
          </div>

          {/* Listening Content Card */}
          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-6 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_rgb(0,0,0,0.4)] transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.1)]">
                <span className="text-2xl">🎧</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                Listening Content
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                {stats?.listeningContent || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Audio lessons
              </p>
            </div>
          </div>

          {/* Grammar Topics Card */}
          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-6 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_rgb(0,0,0,0.4)] transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.1)]">
                <span className="text-2xl">📚</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                Grammar Topics
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                {stats?.grammarTopics || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Grammar lessons
              </p>
            </div>
          </div>

          {/* Total Quizzes Card */}
          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-6 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_rgb(0,0,0,0.4)] transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-cyan-100 to-cyan-50 dark:from-cyan-900/30 dark:to-cyan-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.1)]">
                <span className="text-2xl">📈</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                Total Quizzes
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                {stats?.totalQuizzes || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                All time completions
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.1)]">
              <span className="text-xl">⚡</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
          </div>
          <div className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center mx-auto mb-4 shadow-[0_4px_14px_rgba(0,0,0,0.1)]">
                  <span className="text-3xl">🔔</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Activity tracking coming soon...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

