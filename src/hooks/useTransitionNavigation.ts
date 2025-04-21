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

  // États pour suivre la progression de la navigation
  const [navigationState, setNavigationState] =
    useState<NavigationState>('idle')
  const [transitionDelay, setTransitionDelay] = useState(0)
  const isNavigating = useRef(false)
  const transitionTimeout = useRef<NodeJS.Timeout | null>(null)
  const lastPath = useRef<string | null>(null)

  // Navigation avec transition
  const navigateWithTransition = useCallback(
    (url: string, delay = 800) => {
      // Éviter les navigations multiples pendant les transitions
      if (isNavigating.current) return

      // Éviter la navigation si on est déjà sur l'URL cible
      if (pathname === url || lastPath.current === url) return

      lastPath.current = url
      isNavigating.current = true

      // Déterminer si c'est une transition rapide ou lente
      const isFastTransition = shouldUseFastTransition(pathname || '', url)
      const actualDelay = isFastTransition ? 300 : delay

      setTransitionDelay(actualDelay)
      setNavigationState('navigating')

      // Nettoyer tout timeout existant
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current)
      }

      // Planifier la navigation après le délai
      transitionTimeout.current = setTimeout(() => {
        router.push(url)
        setNavigationState('completed')

        // Réinitialiser l'état après la navigation
        setTimeout(() => {
          isNavigating.current = false
          setNavigationState('idle')
        }, 100)
      }, actualDelay)
    },
    [pathname, router]
  )

  // Déterminer si la transition doit être rapide
  const shouldUseFastTransition = (
    currentUrl: string,
    targetUrl: string
  ): boolean => {
    // Si les deux URL sont des pages de projets ou de catégories, utiliser une transition rapide
    const currentIsProjectUrl =
      currentUrl.includes('/projects/') ||
      currentUrl.includes('/black-and-white') ||
      currentUrl.includes('/early-color')
    const targetIsProjectUrl =
      targetUrl.includes('/projects/') ||
      targetUrl.includes('/black-and-white') ||
      targetUrl.includes('/early-color')
    const currentIsCategoryUrl = currentUrl.includes('/categories/')
    const targetIsCategoryUrl = targetUrl.includes('/categories/')

    return (
      (currentIsProjectUrl && targetIsProjectUrl) ||
      (currentIsCategoryUrl && targetIsCategoryUrl) ||
      (currentIsCategoryUrl && targetIsProjectUrl) ||
      (currentIsProjectUrl && targetIsCategoryUrl)
    )
  }

  return {
    navigateWithTransition,
    navigationState,
    transitionDelay,
  }
}
