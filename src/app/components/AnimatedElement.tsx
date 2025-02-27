'use client'
import { useEffect, useRef, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { useAnimationStore } from '@/store/animationStore'

// Types d'animations disponibles
export enum AnimationType {
  TITLE = 'title',
  FADE = 'fade',
  SLIDE_UP = 'slideUp',
  SLIDE_DOWN = 'slideDown',
  SLIDE_LEFT = 'slideLeft',
  SLIDE_RIGHT = 'slideRight',
  SCALE = 'scale',
}

/**
 * Composant AnimatedElement - Élément avec animations d'entrée et de sortie configurables
 * Bibliothèque d'animations réutilisables pour différents éléments de l'interface
 *
 * @param children - Contenu de l'élément animé
 * @param className - Classes CSS optionnelles
 * @param delay - Délai avant le démarrage de l'animation (en secondes)
 * @param isHeader - Indique si l'élément fait partie du header (comportement spécial)
 * @param type - Type d'animation à appliquer (voir enum AnimationType)
 * @param playExitAnimation - Active/désactive l'animation de sortie
 * @param entrancePatterns - Patterns d'URL pour lesquels l'animation d'entrée sera jouée
 * @param exitPatterns - Patterns d'URL pour lesquels l'animation de sortie sera jouée
 * @param playOnceOnly - Si true, l'animation ne sera jouée qu'une seule fois
 * @param customParams - Paramètres personnalisés pour l'animation (optionnel)
 */
interface AnimatedElementProps {
  children: ReactNode
  className?: string
  delay?: number
  isHeader?: boolean
  type?: AnimationType
  // Paramètres de configuration des animations
  playExitAnimation?: boolean
  entrancePatterns?: string[]
  exitPatterns?: string[]
  playOnceOnly?: boolean
  // Paramètres personnalisés (optionnels)
  customParams?: {
    fromY?: number
    toY?: number
    fromX?: number
    toX?: number
    fromOpacity?: number
    toOpacity?: number
    fromScale?: number
    toScale?: number
    duration?: number
    ease?: string
  }
}

export default function AnimatedElement({
  children,
  className,
  delay = 0,
  isHeader = false,
  type = AnimationType.TITLE,
  // Valeurs par défaut pour les paramètres de configuration
  playExitAnimation = false,
  entrancePatterns = ['/projects'],
  exitPatterns = ['/projects'],
  playOnceOnly = true,
  // Paramètres personnalisés (avec valeurs par défaut)
  customParams = {},
}: AnimatedElementProps) {
  const {
    fromY = -50,
    toY = 0,
    fromX = 0,
    toX = 0,
    fromOpacity = 0,
    toOpacity = 1,
    fromScale = 0.9,
    toScale = 1,
    duration = 0.8,
    ease = 'power3.out',
  } = customParams

  const elementRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.core.Tween | null>(null)
  const hasPlayedRef = useRef<boolean>(false)

  const { hasPlayedHeaderAnimation, setHeaderAnimationPlayed, isLeavingPage } =
    useAnimationStore()

  const pathname = usePathname() || ''

  // Vérifier si le chemin actuel correspond à un pattern d'entrée ou de sortie
  const isEntrancePath = entrancePatterns.some((pattern) =>
    pathname.includes(pattern)
  )
  const isExitPath = exitPatterns.some((pattern) => pathname.includes(pattern))

  // Fonction pour obtenir les paramètres d'animation en fonction du type
  const getAnimationParams = (isExit = false) => {
    // Paramètres de base pour tous les types
    const baseParams = {
      opacity: isExit ? fromOpacity : toOpacity,
      duration: isExit ? duration * 0.6 : duration, // Animation de sortie légèrement plus rapide
      ease: ease,
      delay: isExit ? 0 : delay,
    }

    // Paramètres spécifiques selon le type d'animation
    switch (type) {
      case AnimationType.TITLE:
      case AnimationType.SLIDE_UP:
        return {
          ...baseParams,
          y: isExit ? fromY : toY,
        }
      case AnimationType.SLIDE_DOWN:
        return {
          ...baseParams,
          y: isExit ? -fromY : toY, // Inverse pour slide down
        }
      case AnimationType.SLIDE_LEFT:
        return {
          ...baseParams,
          x: isExit ? fromX : toX,
        }
      case AnimationType.SLIDE_RIGHT:
        return {
          ...baseParams,
          x: isExit ? -fromX : toX, // Inverse pour slide right
        }
      case AnimationType.SCALE:
        return {
          ...baseParams,
          scale: isExit ? fromScale : toScale,
        }
      case AnimationType.FADE:
        return baseParams
      default:
        return baseParams
    }
  }

  // Fonction pour obtenir les paramètres initiaux en fonction du type
  const getInitialParams = () => {
    const baseParams = { opacity: fromOpacity }

    switch (type) {
      case AnimationType.TITLE:
      case AnimationType.SLIDE_UP:
        return { ...baseParams, y: fromY }
      case AnimationType.SLIDE_DOWN:
        return { ...baseParams, y: -fromY }
      case AnimationType.SLIDE_LEFT:
        return { ...baseParams, x: fromX }
      case AnimationType.SLIDE_RIGHT:
        return { ...baseParams, x: -fromX }
      case AnimationType.SCALE:
        return { ...baseParams, scale: fromScale }
      case AnimationType.FADE:
        return baseParams
      default:
        return baseParams
    }
  }

  // Effet pour gérer l'animation de sortie
  useEffect(() => {
    if (!elementRef.current || !playExitAnimation) return

    // Jouer l'animation de sortie si on quitte une page correspondant à un pattern de sortie
    if (isLeavingPage && isExitPath) {
      console.log(`🔄 Animation de sortie (${type})`)
      // Annuler toute animation en cours
      if (animationRef.current) {
        animationRef.current.kill()
      }

      // Jouer l'animation de sortie
      animationRef.current = gsap.to(
        elementRef.current,
        getAnimationParams(true)
      )
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.kill()
      }
    }
  }, [isLeavingPage, playExitAnimation, isExitPath, type])

  // Effet principal pour l'animation d'entrée
  useEffect(() => {
    if (!elementRef.current) return

    // Si on est en train de quitter la page, ne pas jouer d'animation d'entrée
    if (isLeavingPage) return

    // Pour les éléments de header, utiliser la logique spécifique
    if (isHeader) {
      // Si nous sommes sur un chemin d'entrée
      if (isEntrancePath) {
        // Si l'animation a déjà été jouée et qu'on ne doit la jouer qu'une fois
        if (hasPlayedHeaderAnimation && playOnceOnly) {
          console.log('✅ Animation déjà jouée, on garde la position')
          gsap.set(elementRef.current, {
            opacity: toOpacity,
            y: toY,
            x: toX,
            scale: toScale,
          })
          return
        }

        // Si l'animation n'a pas encore été jouée ou si on doit la rejouer
        console.log(`🔄 Animation d'entrée (${type})`)
        animationRef.current = gsap.fromTo(
          elementRef.current,
          getInitialParams(),
          {
            ...getAnimationParams(),
            onComplete: () => {
              if (playOnceOnly) {
                setHeaderAnimationPlayed()
              }
            },
          }
        )
        return
      } else {
        // Si nous ne sommes pas sur un chemin d'entrée, cacher l'élément
        gsap.set(elementRef.current, getInitialParams())
        return
      }
    }

    // Pour les éléments non-header, animation standard
    // Vérifier si l'animation a déjà été jouée pour les animations à jouer une seule fois
    if (playOnceOnly && hasPlayedRef.current) return

    console.log(`⚡ Animation standard (${type})`)
    animationRef.current = gsap.fromTo(elementRef.current, getInitialParams(), {
      ...getAnimationParams(),
      onComplete: () => {
        hasPlayedRef.current = true
      },
    })
  }, [
    delay,
    isHeader,
    hasPlayedHeaderAnimation,
    isEntrancePath,
    isLeavingPage,
    setHeaderAnimationPlayed,
    playOnceOnly,
    type,
  ])

  return (
    <div className="overflow-hidden">
      <div ref={elementRef} className={className}>
        {children}
      </div>
    </div>
  )
}
