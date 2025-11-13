import { BookOpen } from 'lucide-react'

/**
 * AuthMobileLogo Component
 * 
 * Displays app logo and name on mobile auth pages
 * Hidden on desktop where AuthBrandingPanel is shown
 */
export function AuthMobileLogo() {
  return (
    <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <BookOpen className="w-5 h-5 text-primary" />
      </div>
      <h1 className="text-xl font-bold">Learn Quiz English</h1>
    </div>
  )
}
