'use client'

import React, { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from 'next-themes'
import { usePathname } from 'next/navigation'
import Header from './components/Header'
import ThemeToggle from './components/ThemeToggle'
import './globals.css'
import { aujournuit } from './fonts'
import { SANITY_CACHE_CLEAR_EVENT } from '@/adapters/sanity'
import { AnimationProvider } from '@/providers/AnimationProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Émettre un événement pour vider le cache lors des changements de route
  useEffect(() => {
    console.log(
      '🧹 Changement de route détecté, nettoyage du cache Sanity possible'
    )
    // Création et dispatch l'événement global pour que l'adapter Sanity puisse le capter
    if (typeof window !== 'undefined') {
      const clearCacheEvent = new CustomEvent(SANITY_CACHE_CLEAR_EVENT)
      window.dispatchEvent(clearCacheEvent)
    }
  }, [pathname])

  return (
    <html lang="fr" className={aujournuit.className} suppressHydrationWarning>
      <body
        className="transition-colors duration-200 bg-white dark:bg-gray-900 text-black dark:text-white"
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
