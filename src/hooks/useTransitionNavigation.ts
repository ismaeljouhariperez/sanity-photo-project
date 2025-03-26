'use client'
import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useProjectsStore } from '@/store'

/**
 * Hook pour gérer les transitions de navigation entre les pages
 * Utilise le ProjectsStore pour optimiser les transitions entre projets
 */
export function useTransitionNavigation() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  const navigatingRef = useRef(false) // Pour éviter les problèmes de closure

  // Accéder au store de projets
  const { activeCategory, hasFetched } = useProjectsStore()

  const navigateTo = useCallback(
    (url: string, options = { delay: 600 }) => {
      // Si l'URL est identique à l'URL actuelle, ne rien faire
      if (typeof window !== 'undefined' && window.location.pathname === url) {
        return
      }

      // Éviter les navigations multiples
      if (isNavigating || navigatingRef.current) return

      navigatingRef.current = true
      setIsNavigating(true)

      // Analyser l'URL actuelle et l'URL cible
      const currentPath =
        typeof window !== 'undefined' ? window.location.pathname : ''
      const projectUrlPattern = /\/projects\/([^/]+)\/([^/]+)/
      const categoryUrlPattern = /\/projects\/([^/]+)$/

      // Déterminer si on est sur une page détail actuellement
      const isCurrentlyOnDetailPage = projectUrlPattern.test(currentPath)

      // Analyser l'URL de destination
      const projectMatch = url.match(projectUrlPattern)
      const categoryMatch = url.match(categoryUrlPattern)

      // Vérifier si c'est une URL de projet et extraire la catégorie
      const isProjectUrl = projectMatch !== null
      const isCategoryUrl = categoryMatch !== null
      const targetCategory = isProjectUrl
        ? projectMatch[1]
        : isCategoryUrl
        ? categoryMatch[1]
        : null

      // Déterminer si c'est une transition rapide
      const isFastTransition =
        // Navigation détail projet vers liste de projets de même catégorie
        (isCurrentlyOnDetailPage &&
          isCategoryUrl &&
          targetCategory === activeCategory) ||
        // Navigation entre projets de même catégorie
        (isProjectUrl &&
          // Même catégorie que celle active actuellement
          (targetCategory === activeCategory ||
            // Ou bien, si les données sont déjà en cache
            (targetCategory &&
              hasFetched[targetCategory as 'black-and-white' | 'early-color'])))

      // Pour les navigations immédiates
      if (isFastTransition || options.delay === 0) {
        try {
          router.push(url)
        } catch (error) {
          console.error('Navigation error:', error)
        }

        // Réinitialiser l'état après un court délai
        setTimeout(() => {
          setIsNavigating(false)
          navigatingRef.current = false
        }, 100)

        return
      }

      // Pour les autres navigations, utiliser un délai pour l'animation
      setTimeout(() => {
        try {
          router.push(url)
        } catch (error) {
          console.error('Navigation error:', error)
        }

        // Réinitialiser l'état après un court délai
        setTimeout(() => {
          setIsNavigating(false)
          navigatingRef.current = false
        }, 100)
      }, options.delay)
    },
    [router, isNavigating, activeCategory, hasFetched]
  )

  return {
    navigateTo,
    isNavigating,
  }
}
