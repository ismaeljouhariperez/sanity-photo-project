import BaseAnimation, { BaseAnimationProps } from './BaseAnimation'

export interface SlideLeftProps extends BaseAnimationProps {
  distance?: number
}

/**
 * Composant d'animation de glissement vers la gauche
 */
export default function SlideLeftAnimation({
  distance = 50,
  ...props
}: SlideLeftProps) {
  return (
    <BaseAnimation
      {...props}
      animationName="slideLeft"
      getInitialParams={() => ({
        opacity: 0,
        x: distance,
      })}
      getAnimationParams={(isExit = false, delay = 0) => ({
        opacity: isExit ? 0 : 1,
        x: isExit ? distance : 0,
        duration: isExit ? 0.5 : 0.8,
        ease: 'power3.out',
        delay: isExit ? 0 : delay,
      })}
    />
  )
}
