'use client'
import { useEffect, useRef, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { useAnimationStore } from '@/store/animationStore'

/**
 * Props de base pour tous les composants d'animation
 */
export interface BaseAnimationProps {
  children: ReactNode
  className?: string
  delay?: number
  isHeader?: boolean
  // Paramètres de configuration des animations
  playExitAnimation?: boolean
  entrancePatterns?: string[]
  exitPatterns?: string[]
  playOnceOnly?: boolean
  // Callback appelé à la fin de l'animation
  onComplete?: () => void
}

/**
 * Composant de base pour tous les types d'animation
 * Fournit la logique commune de gestion des animations
 */
export default function BaseAnimation({
  children,
  className,
  delay = 0,
  isHeader = false,
  playExitAnimation = false,
  entrancePatterns = ['/projects'],
  exitPatterns = ['/projects'],
  playOnceOnly = true,
  onComplete,

  // Ces méthodes doivent être implémentées par les composants enfants
  getInitialParams,
  getAnimationParams,
  animationName,
}: BaseAnimationProps & {
  // Méthodes qui doivent être implémentées par les composants enfants
  getInitialParams: () => gsap.TweenVars
  getAnimationParams: (isExit?: boolean, delayValue?: number) => gsap.TweenVars
  animationName: string
}) {
  const elementRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.core.Tween | null>(null)
  const hasPlayedRef = useRef<boolean>(false)
  const isAnimatingRef = useRef<boolean>(false)

  const { hasPlayedHeaderAnimation, setHeaderAnimationPlayed, isLeavingPage } =
    useAnimationStore()

  const pathname = usePathname() || ''

  // Générer un ID unique pour ce composant
  const componentId = useRef<string>(
    `anim_${animationName}_${pathname.replace(/\//g, '_')}`
  ).current

  // Vérifier si le chemin actuel correspond à un pattern d'entrée ou de sortie
  const isEntrancePath = entrancePatterns.some((pattern) =>
    pathname.includes(pattern)
  )
  const isExitPath = exitPatterns.some((pattern) => pathname.includes(pattern))

  // Définir l'état initial des éléments dès le montage du composant
  useEffect(() => {
    if (elementRef.current) {
      // Appliquer immédiatement l'état initial pour éviter le flash
      gsap.set(elementRef.current, getInitialParams())
    }
  }, []) // Exécuter une seule fois au montage

  // Vérifier si l'animation a déjà été jouée (persistant entre les rechargements)
  useEffect(() => {
    // Vérifier si nous sommes dans un environnement avec sessionStorage
    if (typeof window !== 'undefined') {
      const hasPlayed = sessionStorage.getItem(componentId) === 'true'
      hasPlayedRef.current = hasPlayed
    }
  }, [componentId])

  // Effet principal pour l'animation d'entrée
  useEffect(() => {
    // S'assurer que l'élément est dans son état initial avant de commencer l'animation
    if (elementRef.current) {
      gsap.set(elementRef.current, getInitialParams())
    }

    // Fonction pour jouer l'animation
    const playAnimation = () => {
      if (!elementRef.current) return
      if (isAnimatingRef.current) return

      // Si on est en train de quitter la page, ne pas jouer d'animation d'entrée
      if (isLeavingPage) return

      // Pour les éléments avec playOnceOnly=true, vérifier si l'animation a déjà été jouée
      if (hasPlayedRef.current && playOnceOnly) {
        // Définir directement l'état final
        gsap.set(elementRef.current, getAnimationParams())
        return
      }

      // Marquer comme en cours d'animation pour éviter les doubles animations
      isAnimatingRef.current = true

      // Pour les éléments de header, utiliser la logique spécifique
      if (isHeader) {
        // Si nous sommes sur un chemin d'entrée
        if (isEntrancePath) {
          // Si l'animation a déjà été jouée et qu'on ne doit la jouer qu'une fois
          if (hasPlayedHeaderAnimation && playOnceOnly) {
            gsap.set(elementRef.current, getAnimationParams())
            isAnimatingRef.current = false
            return
          }

          // Si l'animation n'a pas encore été jouée ou si on doit la rejouer
          animationRef.current = gsap.fromTo(
            elementRef.current,
            getInitialParams(),
            {
              ...getAnimationParams(false, delay),
              onComplete: () => {
                if (playOnceOnly) {
                  setHeaderAnimationPlayed()
                }
                hasPlayedRef.current = true
                isAnimatingRef.current = false
                if (onComplete) onComplete()
              },
            }
          )
          return
        } else {
          // Si nous ne sommes pas sur un chemin d'entrée, cacher l'élément
          gsap.set(elementRef.current, getInitialParams())
          isAnimatingRef.current = false
          return
        }
      }

      // Pour les éléments non-header, animation standard
      animationRef.current = gsap.fromTo(
        elementRef.current,
        getInitialParams(),
        {
          ...getAnimationParams(false, delay),
          onComplete: () => {
            // Seulement mettre à jour hasPlayedRef si playOnceOnly est true
            if (playOnceOnly) {
              hasPlayedRef.current = true
              // Sauvegarder l'état dans sessionStorage pour persister uniquement pendant la session
              if (typeof window !== 'undefined') {
                sessionStorage.setItem(componentId, 'true')
              }
            } else {
              // Pour les animations qui doivent toujours se jouer, réinitialiser hasPlayedRef
              hasPlayedRef.current = false
            }
            isAnimatingRef.current = false
            if (onComplete) onComplete()
          },
        }
      )
    }

    // Jouer l'animation après un court délai pour éviter les problèmes de timing
    const timeoutId = setTimeout(playAnimation, 50)

    // Nettoyer l'animation et le timeout lors du démontage
    return () => {
      clearTimeout(timeoutId)
      if (animationRef.current) {
        animationRef.current.kill()
      }
    }
  }, [pathname]) // Ajouter pathname comme dépendance pour rejouer l'animation à chaque changement de route

  // Effet séparé pour gérer l'animation de sortie
  useEffect(() => {
    if (!elementRef.current || !playExitAnimation) return

    // Jouer l'animation de sortie si on quitte une page correspondant à un pattern de sortie
    if (isLeavingPage && isExitPath) {
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
  }, [isLeavingPage, playExitAnimation, isExitPath])

  return (
    <div className="overflow-hidden">
      <div ref={elementRef} className={className}>
        {children}
      </div>
    </div>
  )
}
