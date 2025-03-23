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

      // Analyser l'URL pour le pattern de projet
      const projectUrlPattern = /\/projects\/([^/]+)\/([^/]+)/
      const match = url.match(projectUrlPattern)

      // Vérifier si c'est une URL de projet et extraire la catégorie
      const isProjectUrl = match !== null
      const targetCategory = isProjectUrl ? match[1] : null

      // Déterminer si c'est une transition rapide
      const isFastTransition =
        isProjectUrl &&
        // Même catégorie que celle active actuellement
        (targetCategory === activeCategory ||
          // Ou bien, si les données sont déjà en cache
          (targetCategory &&
            hasFetched[targetCategory as 'black-and-white' | 'early-color']))

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
