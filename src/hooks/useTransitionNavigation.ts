'use client'
import { useState, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// États pour la navigation
type NavigationState = 'idle' | 'navigating' | 'completed'

/**
 * Hook for managing page transitions and navigation
 * Optimizes transitions between project pages for a smoother UX
 */
export const useTransitionNavigation = () => {
  const router = useRouter()
  const pathname = usePathname()

  // État pour suivre la progression de la navigation
  const [navigationState, setNavigationState] =
    useState<NavigationState>('idle')
  const isNavigating = useRef(false)
  const transitionTimeout = useRef<NodeJS.Timeout | null>(null)
  const lastPath = useRef<string | null>(null)

  // Navigation avec transition simplifiée
  const navigateWithTransition = useCallback(
    (url: string) => {
      // Éviter les navigations multiples pendant les transitions
      if (isNavigating.current) return

      // Éviter la navigation si on est déjà sur l'URL cible
      if (pathname === url || lastPath.current === url) return

      lastPath.current = url
      isNavigating.current = true

      // Nettoyer tout timeout existant
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current)
      }

      // Effectuer la navigation immédiatement pour éviter les problèmes avec les animations
      router.push(url)

      // Marquer comme terminé après un court délai
      setTimeout(() => {
        isNavigating.current = false
        setNavigationState('idle')
      }, 100)
    },
    [pathname, router, setNavigationState]
  )

  return {
    navigateWithTransition,
    navigationState,
  }
}
