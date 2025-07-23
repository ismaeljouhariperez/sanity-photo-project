import { Easing } from 'framer-motion'
import {
  DURATIONS,
  EASE,
  DEFAULT_ANIMATION_OPTIONS,
  DISTANCES,
} from './constants'
import { TransitionAnimation, AnimationOptions, Direction } from './types'

type Position = 'top' | 'bottom'
type TransformValue = { x?: number | string; y?: number | string }

/**
 * Calcule les valeurs de transformation selon la direction et la distance
 */
const getDirectionValue = (
  direction: Direction,
  distance: number | string
): TransformValue => {
  switch (direction) {
    case 'up':
      return { y: -distance }
    case 'down':
      return { y: distance }
    case 'left':
      return { x: -distance }
    case 'right':
      return { x: distance }
  }
}

/**
 * Crée une configuration de transition commune
 */
const createTransitionConfig = (
  options: AnimationOptions = DEFAULT_ANIMATION_OPTIONS,
  overrides: Partial<AnimationOptions> = {}
) => {
  const { speed, ease, delay } = { ...options, ...overrides }
  return {
    duration: DURATIONS[speed || DEFAULT_ANIMATION_OPTIONS.speed],
    ease: EASE[ease || DEFAULT_ANIMATION_OPTIONS.ease] as Easing,
    delay,
  }
}

/**
 * Crée une animation de base avec des états initial, animate et exit
 */
const createBaseAnimation = <T extends Record<string, unknown>>(
  states: {
    initial: T
    animate: T
    exit?: T
  },
  options: AnimationOptions = DEFAULT_ANIMATION_OPTIONS
) => {
  const transition = createTransitionConfig(options)
  const exitTransition = createTransitionConfig(options, { delay: 0 })

  return {
    initial: states.initial,
    animate: {
      ...states.animate,
      transition,
    },
    ...(states.exit && {
      exit: {
        ...states.exit,
        transition: exitTransition,
      },
    }),
  }
}

/**
 * Crée une animation de glissement (slide) avec entrée et sortie
 */
export const createSlideAnimation: TransitionAnimation = (
  direction,
  options = DEFAULT_ANIMATION_OPTIONS
) => {
  const distance = DISTANCES.large

  return createBaseAnimation(
    {
      initial: { ...getDirectionValue(direction, distance), opacity: 0 },
      animate: { ...getDirectionValue(direction, 0), opacity: 1 },
      exit: { ...getDirectionValue(direction, -distance), opacity: 0 },
    },
    options
  )
}

/**
 * Crée un conteneur d'animations avec effets décalés pour les enfants
 */
export const createStaggerContainer = (
  options: AnimationOptions = DEFAULT_ANIMATION_OPTIONS
) => {
  const { staggerChildren, delayChildren } = options

  return {
    initial: {},
    animate: {
      transition: {
        staggerChildren:
          staggerChildren || DEFAULT_ANIMATION_OPTIONS.staggerChildren,
        delayChildren: delayChildren || DEFAULT_ANIMATION_OPTIONS.delayChildren,
      },
    },
    exit: {},
  }
}

/**
 * Crée une animation de base pour les révélations
 */
const createBaseRevealAnimation = (
  options: AnimationOptions = DEFAULT_ANIMATION_OPTIONS,
  initialHeight: string | number = DISTANCES.full,
  targetHeight: string | number = 0,
  position: Position = 'bottom'
) => {
  return createBaseAnimation(
    {
      initial: {
        height: initialHeight,
        [position]: 0,
      },
      animate: {
        height: targetHeight,
        [position]: 0,
      },
    },
    options
  )
}

/**
 * Crée une animation de révélation complète (entrée et sortie)
 */
export const createRevealAnimation = (
  options: AnimationOptions = DEFAULT_ANIMATION_OPTIONS
) => {
  const base = createBaseRevealAnimation(options)
  return {
    ...base,
    exit: {
      height: DISTANCES.full,
      bottom: 0,
      transition: createTransitionConfig(options, { delay: 0 }),
    },
  }
}

/**
 * Crée une animation de dévoilement (de bas en haut)
 */
export const createEntranceRevealAnimation = (
  options: AnimationOptions = DEFAULT_ANIMATION_OPTIONS
) => createBaseRevealAnimation(options, '100%', '0%', 'bottom')

/**
 * Crée une animation de recouvrement (de haut en bas)
 */
export const createExitCoverAnimation = (
  options: AnimationOptions = DEFAULT_ANIMATION_OPTIONS
) => createBaseRevealAnimation(options, 0, '100%', 'top')
