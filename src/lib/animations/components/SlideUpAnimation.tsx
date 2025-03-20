import BaseAnimation, { BaseAnimationProps } from './BaseAnimation'

export interface SlideUpProps extends BaseAnimationProps {
  distance?: number
}

/**
 * Composant d'animation de glissement vers le haut
 */
export default function SlideUpAnimation({
  distance = 50,
  ...props
}: SlideUpProps) {
  return (
    <BaseAnimation
      {...props}
      animationName="slideUp"
      getInitialParams={() => ({
        opacity: 0,
        y: distance,
      })}
      getAnimationParams={(isExit = false, delay = 0) => ({
        opacity: isExit ? 0 : 1,
        y: isExit ? distance : 0,
        duration: isExit ? 0.5 : 0.8,
        ease: 'power3.out',
        delay: isExit ? 0 : delay,
      })}
    />
  )
}
