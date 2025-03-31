import {
  DURATIONS,
  EASE,
  DEFAULT_ANIMATION_OPTIONS,
  DISTANCES,
} from './constants'
import { TransitionAnimation, AnimationOptions, Direction } from './types'

/**
 * Calcule les valeurs de transformation selon la direction et la distance
 */
const getDirectionValue = (direction: Direction, distance: number | string) => {
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
 * Crée une animation de glissement (slide) avec entrée et sortie
 */
export const createSlideAnimation: TransitionAnimation = (
  direction,
  options = DEFAULT_ANIMATION_OPTIONS
) => {
  const { speed, ease, delay } = options
  const distance = DISTANCES.large

  return {
    initial: { ...getDirectionValue(direction, distance), opacity: 0 },
    animate: {
      ...getDirectionValue(direction, 0),
      opacity: 1,
      transition: {
        duration: DURATIONS[speed || DEFAULT_ANIMATION_OPTIONS.speed],
        ease: EASE[ease || DEFAULT_ANIMATION_OPTIONS.ease],
        delay,
      },
    },
    exit: {
      ...getDirectionValue(direction, -distance),
      opacity: 0,
      transition: {
        duration: DURATIONS[speed || DEFAULT_ANIMATION_OPTIONS.speed],
        ease: EASE[ease || DEFAULT_ANIMATION_OPTIONS.ease],
      },
    },
  }
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
 * Crée une animation de révélation complète (entrée et sortie)
 */
export const createRevealAnimation = (
  options: AnimationOptions = DEFAULT_ANIMATION_OPTIONS
) => {
  const { speed, ease, delay } = options

  return {
    initial: {
      bottom: 0,
      height: DISTANCES.full,
    },
    animate: {
      height: 0,
      transition: {
        duration: DURATIONS[speed || DEFAULT_ANIMATION_OPTIONS.speed],
        ease: EASE[ease || DEFAULT_ANIMATION_OPTIONS.ease],
        delay,
      },
    },
    exit: {
      height: DISTANCES.full,
      bottom: 0,
      transition: {
        duration: DURATIONS[speed || DEFAULT_ANIMATION_OPTIONS.speed],
        ease: EASE[ease || DEFAULT_ANIMATION_OPTIONS.ease],
      },
    },
  }
}

/**
 * Crée une animation de dévoilement (de bas en haut)
 */
export const createEntranceRevealAnimation = (
  options: AnimationOptions = DEFAULT_ANIMATION_OPTIONS
) => {
  const { speed, ease, delay } = options

  return {
    initial: {
      height: '100%',
      bottom: 0,
    },
    animate: {
      height: '0%',
      bottom: 0,
      transition: {
        duration: DURATIONS[speed || DEFAULT_ANIMATION_OPTIONS.speed],
        ease: EASE[ease || DEFAULT_ANIMATION_OPTIONS.ease],
        delay,
      },
    },
  }
}

/**
 * Crée une animation de recouvrement (de haut en bas)
 */
export const createExitCoverAnimation = (
  options: AnimationOptions = DEFAULT_ANIMATION_OPTIONS
) => {
  const { speed, ease, delay } = options

  return {
    initial: {
      height: 0,
      top: 0,
    },
    animate: {
      height: '100%',
      top: 0,
      transition: {
        duration: DURATIONS[speed || DEFAULT_ANIMATION_OPTIONS.speed],
        ease: EASE[ease || DEFAULT_ANIMATION_OPTIONS.ease],
        delay,
      },
    },
  }
}
