'use client';

import { StatsCard } from '../components/StatsCard';
import { useAdminStats } from '../hooks/useAdminStats';

export function AdminDashboardPageClient() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-background dark:to-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="animate-pulse space-y-6">
            <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
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
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-3xl">👥</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Users
              </p>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {stats?.totalUsers || 0}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Registered accounts
              </p>
            </div>
          </div>

          {/* Premium Users Card */}
          <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-3xl shadow-[0_8px_30px_rgba(249,115,22,0.4)] hover:shadow-[0_12px_40px_rgba(249,115,22,0.5)] transition-all duration-300 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <span className="text-3xl">👑</span>
              </div>
              <div className="text-sm font-bold text-white bg-white/20 px-3 py-1 rounded-full">
                {premiumPercentage}%
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-orange-100 mb-1">
                Premium Users
              </p>
              <h3 className="text-4xl font-bold text-white mb-2">
                {stats?.premiumUsers || 0}
              </h3>
              <p className="text-sm text-orange-100">
                Active subscribers
              </p>
            </div>
          </div>

          {/* Reading Content Card */}
          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-6 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_rgb(0,0,0,0.4)] transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <span className="text-3xl">📖</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                Reading Content
              </p>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {stats?.readingContent || 0}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Total passages
              </p>
            </div>
          </div>

          {/* Listening Content Card */}
          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-6 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_rgb(0,0,0,0.4)] transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <span className="text-3xl">🎧</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                Listening Content
              </p>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {stats?.listeningContent || 0}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Total exercises
              </p>
            </div>
          </div>

          {/* Grammar Topics Card */}
          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-6 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_rgb(0,0,0,0.4)] transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-3xl">📚</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                Grammar Topics
              </p>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {stats?.grammarTopics || 0}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Active topics
              </p>
            </div>
          </div>

          {/* Total Quizzes Card */}
          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-6 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_rgb(0,0,0,0.4)] transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <span className="text-3xl">✍️</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Quizzes
              </p>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {stats?.totalQuizzes || 0}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                All quiz attempts
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white dark:bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Platform Overview
            </h2>
          </div>
          <div className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Welcome to the admin dashboard. Here you can manage all aspects of the Learn Quiz
              English platform. Use the sidebar navigation to access different sections:
              <br />
              <br />
              • <strong>Users</strong>: Manage user accounts and subscriptions
              <br />
              • <strong>Content</strong>: Add and edit reading, listening, and grammar content
              <br />
              • <strong>Analytics</strong>: View detailed statistics and user progress
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
