import { useRouter } from 'next/navigation'
import { useContext, useCallback } from 'react'
import { useAnimationStore } from '@/store/animationStore'
import { BarbaContext } from '@/app/layout'

/**
 * Hook pour gérer la navigation en toute sécurité, en contournant Barba.js
 * lorsque nécessaire pour éviter les problèmes de navigation et les boucles infinies
 */
export function useSafeNavigation() {
  const router = useRouter()
  const { disableBarba } = useContext(BarbaContext)
  const { setLeavingPage, resetHeaderAnimation } = useAnimationStore()

  /**
   * Navigue vers l'URL spécifiée, avec gestion spéciale pour les routes qui nécessitent
   * de contourner Barba.js afin d'éviter les problèmes de navigation
   *
   * @param url L'URL de destination
   * @param requiresBarbaBypass Indique si la navigation doit contourner Barba.js
   */
  const navigateSafely = useCallback(
    (url: string, requiresBarbaBypass = false) => {
      if (requiresBarbaBypass) {
        // Désactiver Barba.js
        disableBarba()
        console.log(`⚠️ Navigation sécurisée: Barba.js désactivé pour ${url}`)

        // Activer l'animation de sortie
        setLeavingPage(true)

        // Attendre que l'animation se termine
        setTimeout(() => {
          // Réinitialiser les états
          resetHeaderAnimation()
          setLeavingPage(false)

          // Navigation directe en contournant Barba.js
          window.location.href = url
        }, 600)
      } else {
        // Navigation standard via Next.js router
        router.push(url)
      }
    },
    [router, disableBarba, setLeavingPage, resetHeaderAnimation]
  )

  return { navigateSafely }
}
