import BaseAnimation, { BaseAnimationProps } from './BaseAnimation'

export interface SlideDownProps extends BaseAnimationProps {
  distance?: number
}

/**
 * Composant d'animation de glissement vers le bas
 */
export default function SlideDownAnimation({
  distance = 50,
  ...props
}: SlideDownProps) {
  return (
    <BaseAnimation
      {...props}
      animationName="slideDown"
      getInitialParams={() => ({
        opacity: 0,
        y: -distance,
      })}
      getAnimationParams={(isExit = false, delay = 0) => ({
        opacity: isExit ? 0 : 1,
        y: isExit ? -distance : 0,
        duration: isExit ? 0.5 : 0.8,
        ease: 'power3.out',
        delay: isExit ? 0 : delay,
      })}
    />
  )
}
