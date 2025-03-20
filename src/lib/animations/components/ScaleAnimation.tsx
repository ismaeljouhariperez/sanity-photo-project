import BaseAnimation, { BaseAnimationProps } from './BaseAnimation'

export interface ScaleProps extends BaseAnimationProps {
  fromScale?: number
  toScale?: number
}

/**
 * Composant d'animation d'échelle
 */
export default function ScaleAnimation({
  fromScale = 0.9,
  toScale = 1,
  ...props
}: ScaleProps) {
  return (
    <BaseAnimation
      {...props}
      animationName="scale"
      getInitialParams={() => ({
        opacity: 0,
        scale: fromScale,
      })}
      getAnimationParams={(isExit = false, delay = 0) => ({
        opacity: isExit ? 0 : 1,
        scale: isExit ? fromScale : toScale,
        duration: isExit ? 0.5 : 0.8,
        ease: 'power3.out',
        delay: isExit ? 0 : delay,
      })}
    />
  )
}
