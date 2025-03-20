// Composant de base
export { default as BaseAnimation } from './BaseAnimation'
export type { BaseAnimationProps } from './BaseAnimation'

// Animations spécifiques
export { default as Fade } from './FadeAnimation'
export { default as SlideUp } from './SlideUpAnimation'
export { default as SlideDown } from './SlideDownAnimation'
export { default as SlideLeft } from './SlideLeftAnimation'
export { default as SlideRight } from './SlideRightAnimation'
export { default as Scale } from './ScaleAnimation'
export { default as Title } from './TitleAnimation'

// Type des props personnalisées pour chaque animation
export type { SlideUpProps } from './SlideUpAnimation'
export type { SlideDownProps } from './SlideDownAnimation'
export type { SlideLeftProps } from './SlideLeftAnimation'
export type { SlideRightProps } from './SlideRightAnimation'
export type { ScaleProps } from './ScaleAnimation'
