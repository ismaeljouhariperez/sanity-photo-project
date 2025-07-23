'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ThemeProvider } from 'next-themes'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import ThemeToggle from './components/ThemeToggle'
import './globals.css'
import { aujournuit } from './fonts'
import { AnimationProvider } from '@/providers/AnimationProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Simple route change effect - Next.js handles caching natively
  useEffect(() => {
    console.log(`🔄 Route changed to ${pathname}`)
  }, [pathname])

  return (
    <html lang="fr" className={aujournuit.className} suppressHydrationWarning>
      <body
        className="transition-colors duration-200 bg-gray-50 dark:bg-gray-900 text-black dark:text-white"
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AnimationProvider>
            <Header />
            <ThemeToggle />
            <main>
              <AnimatePresence mode="wait">{children}</AnimatePresence>
            </main>
          </AnimationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
