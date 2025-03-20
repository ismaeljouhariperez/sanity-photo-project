'use client'

import React, { createContext, useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from 'next-themes'
import { usePathname } from 'next/navigation'
import Header from './components/Header'
import ThemeToggle from './components/ThemeToggle'
import './globals.css'
import { aujournuit } from './fonts'
import PageTransition from './components/PageTransition'
import { SANITY_CACHE_CLEAR_EVENT } from '@/adapters/sanity'

// Création d'un contexte pour gérer l'état de Barba.js
export const BarbaContext = createContext({
  isBarbaEnabled: true,
  disableBarba: () => {},
  enableBarba: () => {},
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isBarbaEnabled, setIsBarbaEnabled] = useState(true)
  const pathname = usePathname()

  const disableBarba = () => setIsBarbaEnabled(false)
  const enableBarba = () => setIsBarbaEnabled(true)

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
          <BarbaContext.Provider
            value={{ isBarbaEnabled, disableBarba, enableBarba }}
          >
            <Header />
            <ThemeToggle />
            <PageTransition isEnabled={isBarbaEnabled} />
            <div
              data-barba="wrapper"
              className={!isBarbaEnabled ? 'barba-disabled' : ''}
            >
              <div data-barba="container">
                <main>
                  <AnimatePresence mode="wait">{children}</AnimatePresence>
                </main>
              </div>
            </div>
          </BarbaContext.Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
