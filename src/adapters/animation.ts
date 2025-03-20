import type { AnimationState } from '@/store/animationStore'
import { AnimationParams } from '@/lib/animations'
import { AnimationType } from '@/hooks/useAnimation'

export interface IAnimationService {
  setPageTransition(isLeaving: boolean): void
  executeAnimation(
    element: HTMLElement,
    type: AnimationType,
    params?: AnimationParams
  ): void
  stopAnimation(element: HTMLElement): void
}

export class ZustandAnimationAdapter implements IAnimationService {
  constructor(private animationStore: AnimationState) {}

  setPageTransition(isLeaving: boolean): void {
    this.animationStore.setLeavingPage(isLeaving)
  }

  executeAnimation(
    element: HTMLElement,
    type: AnimationType,
    params?: AnimationParams
  ): void {
    // Cette méthode pourrait être utilisée pour déclencher des animations
    // programmatiquement sans utiliser les composants d'animation
    console.log(
      `Animation de type ${type} sur élément avec paramètres:`,
      element,
      params
    )
    // L'implémentation sera ajoutée selon les besoins
  }

  stopAnimation(element: HTMLElement): void {
    // Arrêter une animation en cours
    console.log(`Arrêt de l'animation sur élément`, element)
    // L'implémentation sera ajoutée selon les besoins
  }
}
