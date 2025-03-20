import BaseAnimation, { BaseAnimationProps } from './BaseAnimation'

/**
 * Composant d'animation de fondu
 */
export default function FadeAnimation(props: BaseAnimationProps) {
  return (
    <BaseAnimation
      {...props}
      animationName="fade"
      getInitialParams={() => ({
        opacity: 0,
      })}
      getAnimationParams={(isExit = false, delay = 0) => ({
        opacity: isExit ? 0 : 1,
        duration: isExit ? 0.5 : 0.8,
        ease: 'power3.out',
        delay: isExit ? 0 : delay,
      })}
    />
  )
}
