"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Trophy, Crown, Sparkles, Target, Zap } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

const features = [
  {
    emoji: "📖",
    title: "Grammar Goals",
    description: "Dive into engaging quests. Each lesson unlocks new skills and brings you closer to fluency",
    gradient: "from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20",
    image: "/quest-1.jpg",
  },
  {
    emoji: "🔥",
    title: "Vocabulary Volcano",
    description: "Enhance your listening skills with native speakers and real-world scenarios",
    gradient: "from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20",
    image: "/quest-2.jpg",
  },
  {
    emoji: "⛰️",
    title: "Speaking Summit",
    description: "Master English grammar step by step with interactive exercises",
    gradient: "from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20",
    image: "/quest-3.jpg",
  },
  {
    emoji: "🌊",
    title: "Listening Lagoon",
    description: "Build your personal vocabulary collection and track your progress",
    gradient: "from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20",
    image: "/quest-4.jpg",
  },
];

const achievements = [
  { emoji: "📖", label: "First Lesson", gradient: "from-blue-100 to-blue-50" },
  { emoji: "🔥", label: "7-Day Streak", gradient: "from-orange-100 to-orange-50" },
  { emoji: "🎯", label: "Top Learner", gradient: "from-green-100 to-green-50" },
  { emoji: "📝", label: "Grammar Guru", gradient: "from-purple-100 to-purple-50" },
  { emoji: "⚡", label: "Quick Thinker", gradient: "from-yellow-100 to-yellow-50" },
  { emoji: "👥", label: "Community Helper", gradient: "from-pink-100 to-pink-50" },
];

export default function Home() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-12 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white leading-tight">
                Your English
                <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-orange-600">
                  Adventure Starts
                </span>
                <br />
                Now.
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Transform learning into a game. Complete quests, earn badges, and master English with confidence. Ready to level up?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  asChild
                  className="rounded-3xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300 px-8 py-6 text-base"
                >
                  <Link href="/reading">Start Your Adventure</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-3xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 px-8 py-6 text-base transition-all duration-300"
                >
                  <Link href="#demo">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Content - Floating Icons */}
            <div className="relative order-1 lg:order-2 h-[400px] lg:h-[500px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-[120px] lg:text-[160px] animate-pulse">🌍</div>
              </div>
              
              {/* Floating Badge 1 - Top Right */}
              <div 
                className="absolute top-8 right-8 bg-white dark:bg-card rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-4 animate-bounce" 
                style={{ animationDuration: '3s' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-800/10 flex items-center justify-center">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">First Lesson</p>
                    <p className="font-bold text-gray-900 dark:text-white">Completed!</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge 2 - Left */}
              <div 
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-card rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-4 animate-bounce" 
                style={{ animationDuration: '4s', animationDelay: '0.5s' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-800/10 flex items-center justify-center">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Live Class</p>
                    <p className="font-bold text-gray-900 dark:text-white">Join Now</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge 3 - Bottom */}
              <div 
                className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white dark:bg-card rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-4 animate-bounce" 
                style={{ animationDuration: '3.5s', animationDelay: '1s' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/10 flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Extra Badges</p>
                    <p className="font-bold text-gray-900 dark:text-white">+50 XP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Path Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-50 dark:bg-gray-900/30">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Chart Your Path to Fluency
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Visualize your progress from novice to advanced with interactive pathways and achievements as you level up your English skills with step-by-step milestones
          </p>
        </div>

        {/* Level Progress Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-4 gap-3 md:gap-4 mb-4">
            <div className="text-center">
              <div className="text-xs md:text-sm font-semibold text-orange-600 dark:text-orange-400 mb-2">Beginner</div>
              <div className="h-2 rounded-full bg-linear-to-r from-orange-400 to-orange-500" />
            </div>
            <div className="text-center">
              <div className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Intermediate</div>
              <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="text-center">
              <div className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Advanced</div>
              <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="text-center">
              <div className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Expert</div>
              <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            You're 65% of the way to Intermediate! Keep going.
          </p>
        </div>
      </section>

      {/* Discover Quests Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Your Next Quest
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Dive into engaging quests. Each lesson unlocks new skills and brings you closer to fluency with gamified, skill-building quests designed to excite
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Link 
              key={feature.title} 
              href={index === 0 ? "/grammar" : index === 2 ? "/reading" : index === 3 ? "/listening" : "/my-words"}
            >
              <div className="group bg-white dark:bg-card rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_rgb(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1">
                {/* Image placeholder with gradient and emoji */}
                <div className={`h-48 bg-linear-to-br ${feature.gradient} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                  <div className="relative text-7xl transform group-hover:scale-110 transition-transform duration-300">
                    {feature.emoji}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Achievement Section */}
      <section className="container mx-auto px-4 py-16 bg-linear-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Collect & Flaunt Your Achievements
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Every achievement earned is a step forward! Rack up achievements and badges that showcase your progress and dedication as you climb the ranks
            </p>
          </div>

          {/* Achievement Icons */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 max-w-4xl mx-auto mb-8">
            {achievements.map((achievement) => (
              <div key={achievement.label} className="flex flex-col items-center">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-linear-to-br ${achievement.gradient} dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 cursor-pointer mb-3`}>
                  <span className="text-2xl md:text-3xl">{achievement.emoji}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center font-medium">
                  {achievement.label}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/statistics">
              <Button className="rounded-3xl bg-white dark:bg-card text-orange-600 dark:text-orange-400 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all duration-300 px-8 py-6 text-base">
                <Trophy className="mr-2 h-5 w-5" />
                View Your Statistics
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-linear-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-3xl p-8 md:p-12 shadow-[0_20px_60px_rgba(249,115,22,0.3)] text-center text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-white/10 rounded-full -translate-y-24 md:-translate-y-32 translate-x-24 md:translate-x-32" />
            <div className="absolute bottom-0 left-0 w-32 md:w-48 h-32 md:h-48 bg-white/10 rounded-full translate-y-16 md:translate-y-24 -translate-x-16 md:-translate-x-24" />
            
            <div className="relative z-10">
              <Crown className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Unlock Premium Features
              </h2>
              <p className="text-lg md:text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                Get unlimited access to all content, personalized learning paths, and advanced features
              </p>
              <Button
                asChild
                className="rounded-3xl bg-white text-orange-600 hover:bg-gray-50 font-medium shadow-[0_4px_14px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] transition-all duration-300 px-8 py-6 text-base"
              >
                <Link href="/premium">Upgrade to Premium</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
