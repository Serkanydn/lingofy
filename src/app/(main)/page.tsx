'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, Headphones, BookText, BookMarked, Crown, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/lib/store/authStore'

export default function HomePage() {
  const { user } = useAuthStore()
  const isPremium = useAuthStore((state) => state.isPremium())

  const features = [
    {
      title: 'Reading Practice',
      description: '500+ texts across all levels (A1-C1)',
      icon: BookOpen,
      href: '/reading',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Listening Practice',
      description: 'Improve comprehension with audio content',
      icon: Headphones,
      href: '/listening',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Grammar Lessons',
      description: 'Master English grammar - 100% free!',
      icon: BookText,
      href: '/grammar',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'My Words',
      description: 'Build your personal vocabulary',
      icon: BookMarked,
      href: '/my-words',
      color: 'from-orange-500 to-red-500',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to Learn&Quiz English
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Master English at your own pace with engaging content, interactive quizzes, and personalized learning
        </p>
        {!user && (
          <div className="mt-8 flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {features.map((feature) => (
          <Link key={feature.title} href={feature.href}>
            <Card className="hover:shadow-lg transition-all cursor-pointer h-full group">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="group-hover:translate-x-2 transition-transform">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Premium CTA */}
      {!isPremium && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">Upgrade to Premium</h3>
                  <p className="text-muted-foreground">
                    Unlock 500+ premium content, detailed statistics, and ad-free experience
                  </p>
                </div>
              </div>
              <Link href="/premium">
                <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600">
                  <Crown className="mr-2 h-5 w-5" />
                  Learn More
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* How It Works */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'Choose Your Level',
              description: 'Select content matching your English proficiency from A1 to C1',
            },
            {
              step: '2',
              title: 'Learn & Practice',
              description: 'Read texts, listen to audio, and study grammar at your own pace',},
            {
              step: '3',
              title: 'Test Your Knowledge',
              description: 'Take quizzes, build vocabulary, and track your progress',
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}