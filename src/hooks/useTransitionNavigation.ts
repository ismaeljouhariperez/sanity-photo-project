'use client'
import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

export function useTransitionNavigation() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  const navigatingRef = useRef(false) // Pour éviter les problèmes de closure

  const navigateTo = useCallback(
    (url: string, options = { delay: 600 }) => {
      // Éviter les navigations multiples
      if (isNavigating || navigatingRef.current) return

      navigatingRef.current = true
      setIsNavigating(true)

      // Pour les navigations instantanées (sans animation de sortie)
      if (options.delay === 0) {
        router.push(url)

        // Réinitialiser l'état après un court délai
        setTimeout(() => {
          setIsNavigating(false)
          navigatingRef.current = false
        }, 100)

        return
      }

      // Laisser le temps à l'animation de sortie de se produire
      setTimeout(() => {
        router.push(url)

        // Réinitialiser l'état après un court délai
        setTimeout(() => {
          setIsNavigating(false)
          navigatingRef.current = false
        }, 100)
      }, options.delay)
    },
    [router, isNavigating]
  )

  return {
    navigateTo,
    isNavigating,
  }
}
