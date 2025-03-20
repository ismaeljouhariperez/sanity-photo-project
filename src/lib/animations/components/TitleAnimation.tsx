import BaseAnimation, { BaseAnimationProps } from './BaseAnimation'

/**
 * Composant d'animation pour les titres
 * Animation combinant un fade et un slide-up avec des paramètres optimisés
 */
export default function TitleAnimation(props: BaseAnimationProps) {
  return (
    <BaseAnimation
      {...props}
      animationName="title"
      // Par défaut, les animations de titre sont jouées une seule fois
      playOnceOnly={
        props.playOnceOnly !== undefined ? props.playOnceOnly : true
      }
      // Les titres sont souvent dans le header
      isHeader={props.isHeader !== undefined ? props.isHeader : true}
      getInitialParams={() => ({
        opacity: 0,
        y: -30,
      })}
      getAnimationParams={(isExit = false, delay = 0) => ({
        opacity: isExit ? 0 : 1,
        y: isExit ? -30 : 0,
        duration: isExit ? 0.4 : 0.7,
        ease: 'power2.out',
        delay: isExit ? 0 : delay,
      })}
    />
  )
}
