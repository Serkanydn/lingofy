'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Crown } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PaywallModalProps {
  open: boolean
  onClose: () => void
}

const PREMIUM_FEATURES = [
  'Access to 500+ reading texts',
  'Unlimited listening practice',
  'Advanced statistics & progress tracking',
  'Ad-free experience',
  'Early access to new content',
  'Priority support',
]

export function PaywallModal({ open, onClose }: PaywallModalProps) {
  const router = useRouter()

  const handleUpgrade = () => {
    router.push('/premium')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-linear-to-r from-yellow-400 to-orange-500 p-3 rounded-full">
              <Crown className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription className="text-center">
            Unlock all features and supercharge your English learning
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {PREMIUM_FEATURES.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-1">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="bg-linear-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Special Offer</p>
              <p className="text-sm text-muted-foreground">Starting from ₺49.90/month</p>
            </div>
            <Badge variant="secondary" className="bg-yellow-400 text-yellow-900">
              Save 33%
            </Badge>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Maybe Later
          </Button>
          <Button onClick={handleUpgrade} className="flex-1 bg-linear-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600">
            <Crown className="mr-2 h-4 w-4" />
            Upgrade Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}