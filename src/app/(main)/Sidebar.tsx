'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Headphones, BookText, BookMarked, Crown, BarChart3, Home } from 'lucide-react'
import { useAuthStore } from '@/shared/hooks/useAuth'
import { cn } from '@/shared/lib/utils'
import { PremiumBadge } from '@/features/premium/components/PremiumBadge'


const navigation = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
  },
  {
    name: 'Reading',
    href: '/reading',
    icon: BookOpen,
  },
  {
    name: 'Listening',
    href: '/listening',
    icon: Headphones,
  },
  {
    name: 'Grammar',
    href: '/grammar',
    icon: BookText,
  },
  {
    name: 'My Words',
    href: '/my-words',
    icon: BookMarked,
    requiresAuth: true,
  },
  {
    name: 'Statistics',
    href: '/statistics',
    icon: BarChart3,
    requiresPremium: true,
  },
  {
    name: 'Premium',
    href: '/premium',
    icon: Crown,
    hideWhenPremium: true,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const isPremium = useAuthStore((state) => state.isPremium())

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col pt-16">
      <div className="flex flex-col flex-1 min-h-0 border-r bg-card">
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            // Hide if requires auth and user not logged in
            if (item.requiresAuth && !user) return null
            
            // Hide if requires premium and user not premium
            if (item.requiresPremium && !isPremium) return null
            
            // Hide premium link if user is already premium
            if (item.hideWhenPremium && isPremium) return null

            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
                {item.requiresPremium && (
                  <PremiumBadge />
                )}
              </Link>
            )
          })}
        </nav>

        {isPremium && (
          <div className="p-4 border-t">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="h-4 w-4 text-yellow-600" />
                <span className="font-semibold text-sm">Premium Active</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Enjoying all premium features
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}