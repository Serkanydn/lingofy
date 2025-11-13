import { Sparkles, BookOpen, Trophy, Target } from 'lucide-react'

/**
 * AuthBrandingPanel Component
 * 
 * Displays branding, features, and inspirational quote on auth pages
 * Only visible on large screens (desktop)
 */
export function AuthBrandingPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary via-primary/90 to-primary/80 dark:from-primary/20 dark:via-primary/15 dark:to-primary/10 p-12 flex-col justify-between relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
      <div className="absolute top-20 -left-20 w-72 h-72 bg-primary-foreground/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/20">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground">Learn Quiz English</h1>
            <p className="text-sm text-primary-foreground/70">Master English with confidence</p>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-6 mt-16">
          <div className="flex items-start gap-4 group">
            <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/20 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-foreground mb-1">AI-Powered Learning</h3>
              <p className="text-sm text-primary-foreground/70">Personalized quizzes adapted to your level</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 group">
            <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/20 group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-foreground mb-1">Track Your Progress</h3>
              <p className="text-sm text-primary-foreground/70">Detailed statistics and achievement system</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 group">
            <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/20 group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-foreground mb-1">Comprehensive Practice</h3>
              <p className="text-sm text-primary-foreground/70">Grammar, reading, listening, and vocabulary</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Quote */}
      <div className="relative z-10">
        <blockquote className="text-primary-foreground/90 text-lg italic">
          "The journey of a thousand miles begins with a single step."
        </blockquote>
        <p className="text-primary-foreground/60 text-sm mt-2">— Lao Tzu</p>
      </div>
    </div>
  )
}
