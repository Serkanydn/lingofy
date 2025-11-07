'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Zap } from 'lucide-react'
import { PRICING } from '@/shared/lib/lemonsqueezy/config'
import { useAuth } from '@/features/auth/hooks/useAuth'


const PREMIUM_FEATURES = [
  {
    title: '500+ Premium Content',
    description: 'Access all reading texts and listening exercises across all levels',
  },
  {
    title: 'Advanced Statistics',
    description: 'Track your progress with detailed analytics and insights',
  },
  {
    title: 'Ad-Free Experience',
    description: 'Focus on learning without any distractions',
  },
  {
    title: 'Early Access',
    description: 'Get new content 3 days before free users',
  },
  {
    title: 'Priority Support',
    description: 'Get help faster with dedicated support',
  },
  {
    title: 'Unlimited Practice',
    description: 'No limits on quizzes, flashcards, or any feature',
  },
]

export default function PremiumPage() {
  const { user, profile, isPremium } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly')
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Authentication Required', {
        description: 'Please login to subscribe',
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: selectedPlan,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to create checkout session',
      })
    } finally {
      setLoading(false)
    }
  }

  if (isPremium) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-linear-to-r from-yellow-400 to-orange-500 p-4 rounded-full">
                <Crown className="h-12 w-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl">You're a Premium Member!</CardTitle>
            <CardDescription className="text-lg">
              Enjoy all premium features and continue your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/'} size="lg">
              Continue Learning
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="bg-linear-to-r from-yellow-400 to-orange-500 p-3 rounded-full">
            <Crown className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">Upgrade to Premium</h1>
        <p className="text-xl text-muted-foreground">
          Unlock your full English learning potential
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
        <Card 
          className={`cursor-pointer transition-all ${
            selectedPlan === 'monthly' 
              ? 'border-primary ring-2 ring-primary' 
              : 'hover:border-primary/50'
          }`}
          onClick={() => setSelectedPlan('monthly')}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Monthly</CardTitle>
              {selectedPlan === 'monthly' && (
                <Zap className="h-5 w-5 text-primary" />
              )}
            </div>
            <CardDescription>Flexible month-to-month billing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-4xl font-bold">{PRICING.monthly.currency}{PRICING.monthly.price}</span>
              <span className="text-muted-foreground">/{PRICING.monthly.interval}</span>
            </div>
            <ul className="space-y-2">
              {PREMIUM_FEATURES.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{feature.title}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all relative ${
            selectedPlan === 'yearly' 
              ? 'border-primary ring-2 ring-primary' 
              : 'hover:border-primary/50'
          }`}
          onClick={() => setSelectedPlan('yearly')}
        >
          <Badge className="absolute -top-3 right-4 bg-linear-to-r from-yellow-400 to-orange-500">
            Save {PRICING.yearly.discount}
          </Badge>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Yearly</CardTitle>
              {selectedPlan === 'yearly' && (
                <Zap className="h-5 w-5 text-primary" />
              )}
            </div>
            <CardDescription>Best value - save big!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-4xl font-bold">{PRICING.yearly.currency}{PRICING.yearly.price}</span>
              <span className="text-muted-foreground">/{PRICING.yearly.interval}</span>
              <div className="text-sm text-green-600 font-medium mt-1">
                Only ₺33.33/month
              </div>
            </div>
            <ul className="space-y-2">
              {PREMIUM_FEATURES.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{feature.title}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mb-12">
        <Button 
          size="lg" 
          className="bg-linear-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-lg px-12"
          onClick={handleSubscribe}
          disabled={loading}
        >
          <Crown className="mr-2 h-5 w-5" />
          {loading ? 'Processing...' : 'Subscribe Now'}
        </Button>
      </div>

      {/* Features Grid */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Everything You Get with Premium</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PREMIUM_FEATURES.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-2">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}