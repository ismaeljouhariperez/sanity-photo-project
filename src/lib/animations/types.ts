/**
 * Interface commune pour les paramètres d'animation
 */
export interface AnimationParams {
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
  delay?: number
}

/**
 * Configuration pour les animations d'entrée/sortie
 */
export interface AnimationConfig {
  delay?: number
  playExitAnimation?: boolean
  entrancePatterns?: string[]
  exitPatterns?: string[]
  playOnceOnly?: boolean
  customParams?: AnimationParams
}
