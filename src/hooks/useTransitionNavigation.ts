'use client'
import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

export function useTransitionNavigation() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  const navigatingRef = useRef(false) // Pour éviter les problèmes de closure

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

      // Détecter si c'est une navigation entre projets
      const isProjectNavigation =
        url.includes('/projects/') &&
        window.location.pathname.includes('/projects/')

      // Pour les navigations entre projets, utiliser une transition immédiate
      if (isProjectNavigation || options.delay === 0) {
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
    [router, isNavigating]
  )

  return {
    navigateTo,
    isNavigating,
  }
}
