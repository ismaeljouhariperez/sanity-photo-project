'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useProjectsStore } from '@/store'
import { motion } from 'framer-motion'

interface SharedProjectsLayoutProps {
  children: React.ReactNode
}

/**
 * Layout partagé pour toutes les pages de projets
 * Maintient une structure cohérente pour la navigation entre les pages
 * et gère les animations de transition
 */
export default function SharedProjectsLayout({
  children,
}: SharedProjectsLayoutProps) {
  const pathname = usePathname()
  const setProjectViewMounted = useProjectsStore(
    (state) => state.setProjectViewMounted
  )
  const setPreviousPathname = useProjectsStore(
    (state) => state.setPreviousPathname
  )
  const [category, setCategory] = useState<
    'black-and-white' | 'early-color' | null
  >(null)

  // Extraire la catégorie de l'URL
  useEffect(() => {
    if (!pathname) return

    // Stocker le chemin actuel pour la prochaine navigation
    setPreviousPathname(pathname)

    // Extraire la catégorie de l'URL
    // Format: /black-and-white ou /black-and-white/slug
    const directMatch = pathname.match(/\/([^\/]+)/)
    if (directMatch) {
      const [, extractedCategory] = directMatch
      if (
        extractedCategory === 'black-and-white' ||
        extractedCategory === 'early-color'
      ) {
        setCategory(extractedCategory)
        setProjectViewMounted(true)
      }
    }
  }, [pathname, setPreviousPathname, setProjectViewMounted])

  if (!category) return null

  return (
    <div className="relative">
      <motion.div
        key={pathname}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        {children}
      </motion.div>
    </div>
  )
}
