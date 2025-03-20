import { useRef, useCallback } from 'react'
import { useServices } from './useServices'
import { AnimationParams } from '@/lib/animations'
import gsap from 'gsap'

export type AnimationType =
  | 'fade'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scale'

interface UseAnimationResult {
  animateElement: (
    element: HTMLElement,
    animationType: AnimationType,
    params?: AnimationParams,
    onComplete?: () => void
  ) => void
  stopAnimation: (element: HTMLElement) => void
  isAnimating: boolean
}

/**
 * Hook pour gérer les animations de manière programmatique
 */
export function useAnimation(): UseAnimationResult {
  const { animation } = useServices()
  const currentAnimationRef = useRef<gsap.core.Tween | null>(null)
  const isAnimatingRef = useRef<boolean>(false)

  const animateElement = useCallback(
    (
      element: HTMLElement,
      animationType: AnimationType,
      params: AnimationParams = {},
      onComplete?: () => void
    ) => {
      if (isAnimatingRef.current) {
        // Arrêter l'animation en cours avant d'en démarrer une nouvelle
        if (currentAnimationRef.current) {
          currentAnimationRef.current.kill()
        }
      }

      // Marquer comme en cours d'animation
      isAnimatingRef.current = true

      // Paramètres par défaut
      const defaultParams: AnimationParams = {
        fromY: -50,
        toY: 0,
        fromX: 0,
        toX: 0,
        fromOpacity: 0,
        toOpacity: 1,
        fromScale: 0.9,
        toScale: 1,
        duration: 0.8,
        ease: 'power3.out',
        ...params,
      }

      // Définir l'état initial et les paramètres d'animation selon le type
      let initialState: gsap.TweenVars = {
        opacity: defaultParams.fromOpacity || 0,
      }
      let animationParams: gsap.TweenVars = {
        opacity: defaultParams.toOpacity || 1,
        duration: defaultParams.duration || 0.8,
        ease: defaultParams.ease || 'power3.out',
        delay: defaultParams.delay || 0,
      }

      // Définir les paramètres spécifiques à chaque animation
      switch (animationType) {
        case 'fade':
          // Déjà configuré avec les paramètres par défaut
          break
        case 'slideUp':
          initialState = { ...initialState, y: defaultParams.fromY || -50 }
          animationParams = { ...animationParams, y: defaultParams.toY || 0 }
          break
        case 'slideDown':
          initialState = { ...initialState, y: -(defaultParams.fromY || -50) }
          animationParams = { ...animationParams, y: defaultParams.toY || 0 }
          break
        case 'slideLeft':
          initialState = { ...initialState, x: defaultParams.fromX || 0 }
          animationParams = { ...animationParams, x: defaultParams.toX || 0 }
          break
        case 'slideRight':
          initialState = { ...initialState, x: -(defaultParams.fromX || 0) }
          animationParams = { ...animationParams, x: defaultParams.toX || 0 }
          break
        case 'scale':
          initialState = {
            ...initialState,
            scale: defaultParams.fromScale || 0.9,
          }
          animationParams = {
            ...animationParams,
            scale: defaultParams.toScale || 1,
          }
          break
      }

      // Définir l'état initial
      gsap.set(element, initialState)

      // Exécuter l'animation
      currentAnimationRef.current = gsap.to(element, {
        ...animationParams,
        onComplete: () => {
          isAnimatingRef.current = false
          if (onComplete) onComplete()
        },
      })

      // Notifier l'adaptateur (pour la journalisation ou autre)
      animation.executeAnimation(element, animationType, defaultParams)
    },
    [animation]
  )

  const stopAnimation = useCallback(
    (element: HTMLElement) => {
      if (currentAnimationRef.current) {
        currentAnimationRef.current.kill()
        currentAnimationRef.current = null
      }
      isAnimatingRef.current = false
      animation.stopAnimation(element)
    },
    [animation]
  )

  return {
    animateElement,
    stopAnimation,
    isAnimating: isAnimatingRef.current,
  }
}
