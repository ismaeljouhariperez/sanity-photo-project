import { Variants } from 'framer-motion'

export type Direction = 'up' | 'down' | 'left' | 'right'
export type AnimationSpeed = 'fast' | 'normal' | 'slow' | 'slower'
export type EaseType = 'default' | 'linear' | 'bounce' | 'elastic'

export interface AnimationOptions {
  speed?: AnimationSpeed
  ease?: EaseType
  delay?: number
  staggerChildren?: number
  delayChildren?: number
}

export type TransitionAnimation = (
  direction: Direction,
  options?: AnimationOptions
) => Variants
export type HoverAnimation = (options?: AnimationOptions) => Variants
export type LoadingAnimation = (options?: AnimationOptions) => Variants
