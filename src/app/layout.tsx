import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/shared/components/providers/QueryProvider'
import { AuthProvider } from '@/shared/providers/AuthProvider'
import { Toaster } from '@/components/ui/sonner'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Learn&Quiz English - Master English at Your Own Pace',
  description: 'Interactive English learning platform with reading, listening, grammar, and vocabulary practice for all levels.',
  keywords: ['English learning', 'ESL', 'English practice', 'reading', 'listening', 'grammar'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}