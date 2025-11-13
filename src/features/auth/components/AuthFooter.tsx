import Link from 'next/link'

/**
 * AuthFooter Component
 * 
 * Footer with terms and privacy policy links
 */
export function AuthFooter() {
  return (
    <p className="text-center text-xs text-muted-foreground mt-8">
      By continuing, you agree to our{' '}
      <Link href="/terms" className="underline hover:text-foreground transition-colors">
        Terms of Service
      </Link>{' '}
      and{' '}
      <Link href="/privacy" className="underline hover:text-foreground transition-colors">
        Privacy Policy
      </Link>
    </p>
  )
}
