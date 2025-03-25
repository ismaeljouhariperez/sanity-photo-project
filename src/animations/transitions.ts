import {
  DURATIONS,
  EASE,
  DEFAULT_ANIMATION_OPTIONS,
  DISTANCES,
} from './constants'
import { TransitionAnimation, AnimationOptions, Direction } from './types'

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
