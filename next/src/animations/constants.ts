import { EaseType, AnimationSpeed } from './types'

export const DURATIONS: Record<AnimationSpeed, number> = {
  fast: 0.2,
  normal: 0.5,
  slow: 0.9,
  slower: 1.2,
}

export const EASE = {
  default: [0.16, 1, 0.3, 1] as const,
  linear: [0, 0, 1, 1] as const,
  bounce: [0.87, 0, 0.13, 1] as const,
  elastic: [0.68, -0.55, 0.265, 1.55] as const,
} as const

// Valeurs par défaut pour les animations
export const DEFAULT_ANIMATION_OPTIONS = {
  speed: 'normal' as AnimationSpeed,
  ease: 'default' as EaseType,
  delay: 0,
  staggerChildren: 0.1,
  delayChildren: 0.2,
}

// Distances de déplacement pour les animations (en pixels ou %)
export const DISTANCES = {
  small: 10,
  medium: 50,
  large: 100,
  full: '100%',
}
