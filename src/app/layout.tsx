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
import { SANITY_CACHE_CLEAR_EVENT } from '@/adapters/sanity'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Effet pour nettoyer le cache Sanity quand la route change
  useEffect(() => {
    // Clé pour stocker le chemin précédent
    const PREV_PATH_KEY = 'prev_sanity_path'

    // Récupérer le chemin précédent
    const prevPath = sessionStorage.getItem(PREV_PATH_KEY) || ''

    // Vérifier si la navigation est entre pages de projets
    const isCurrentProjectPath = pathname?.includes('/projects/')
    const isPrevProjectPath = prevPath?.includes('/projects/')

    // Stocker le chemin actuel pour la prochaine navigation
    sessionStorage.setItem(PREV_PATH_KEY, pathname || '')

    // Déterminer s'il faut nettoyer le cache
    const shouldClearCache = !(isCurrentProjectPath && isPrevProjectPath)

    console.log(
      `🔄 Route changée de ${prevPath} → ${pathname}${
        shouldClearCache ? ' (nettoyage cache)' : ' (préservation cache)'
      }`
    )

    // Émettre l'événement seulement si nécessaire
    if (shouldClearCache) {
      // Créer un événement personnalisé pour nettoyer le cache avec des informations sur le chemin
      const event = new CustomEvent(SANITY_CACHE_CLEAR_EVENT, {
        detail: { path: pathname },
      })

      // Déclencher l'événement
      window.dispatchEvent(event)
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
