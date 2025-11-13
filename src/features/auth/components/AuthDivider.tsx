/**
 * AuthDivider Component
 * 
 * Decorative divider with text for auth forms
 */
export function AuthDivider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border/50" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card px-3 text-muted-foreground font-medium">
          Or continue with email
        </span>
      </div>
    </div>
  )
}
