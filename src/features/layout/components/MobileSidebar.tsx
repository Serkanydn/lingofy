'use client'

import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Headphones, BookText, BookMarked, Crown, BarChart3, Home } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/shared/lib/utils'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Reading', href: '/reading', icon: BookOpen },
  { name: 'Listening', href: '/listening', icon: Headphones },
  { name: 'Grammar', href: '/grammar', icon: BookText },
  { name: 'My Words', href: '/my-words', icon: BookMarked, requiresAuth: true },
  { name: 'Statistics', href: '/statistics', icon: BarChart3, requiresPremium: true },
  { name: 'Premium', href: '/premium', icon: Crown, hideWhenPremium: true },
]

export function MobileSidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const isPremium = useAuthStore((state) => state.isPremium())
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full py-6">
          <div className="px-4 mb-6">
            <h2 className="text-lg font-semibold">Menu</h2>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => {
              if (item.requiresAuth && !user) return null
              if (item.requiresPremium && !isPremium) return null
              if (item.hideWhenPremium && isPremium) return null

              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}