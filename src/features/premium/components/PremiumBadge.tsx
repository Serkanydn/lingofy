import { Crown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function PremiumBadge() {
  return (
    <Badge className="bg-linear-to-r from-yellow-400 to-orange-500 text-white border-none">
      <Crown className="mr-1 h-3 w-3" />
      Premium
    </Badge>
  )
}