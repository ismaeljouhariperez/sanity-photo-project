import { useRouter } from 'next/navigation'
import { useAnimationStore } from '@/store/animationStore'
import {
  NextNavigationAdapter,
  ZustandAnimationAdapter,
  SanityAdapter,
} from '@/adapters'

export function useServices() {
  const router = useRouter()
  const animationStore = useAnimationStore()

  return {
    navigation: new NextNavigationAdapter(router),
    animation: new ZustandAnimationAdapter(animationStore),
    sanity: new SanityAdapter(),
  }
}

// Adapter amélioré pour intégrer la navigation sécurisée
export class SafeNavigationAdapter extends NextNavigationAdapter {
  private disableBarba: (() => void) | null
  private setLeavingPage: ((state: boolean) => void) | null
  private resetHeaderAnimation: (() => void) | null

  constructor(
    router: any,
    disableBarba: (() => void) | null = null,
    setLeavingPage: ((state: boolean) => void) | null = null,
    resetHeaderAnimation: (() => void) | null = null
  ) {
    super(router)
    this.disableBarba = disableBarba
    this.setLeavingPage = setLeavingPage
    this.resetHeaderAnimation = resetHeaderAnimation
  }

  // Navigation sécurisée qui contourne Barba.js au besoin
  navigateSafely(url: string, requiresBarbaBypass = false): void {
    // Si la navigation nécessite de contourner Barba et que nous avons les fonctions nécessaires
    if (requiresBarbaBypass && this.disableBarba && this.setLeavingPage) {
      // Désactiver Barba.js
      this.disableBarba()
      console.log(`⚠️ Barba.js désactivé pour navigation vers ${url}`)

      // Activer l'animation de sortie
      this.setLeavingPage(true)

      // Attendre que l'animation se termine
      setTimeout(() => {
        // Réinitialiser les états
        if (this.resetHeaderAnimation) this.resetHeaderAnimation()
        if (this.setLeavingPage) this.setLeavingPage(false)

        // Navigation directe en contournant Barba.js
        window.location.href = url
      }, 600)
    } else {
      // Navigation standard
      this.navigateTo(url)
    }
  }
}
