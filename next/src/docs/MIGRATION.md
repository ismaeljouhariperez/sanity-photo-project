# Guide de Migration Animation System

Ce guide vous aide à migrer du système d'animation legacy vers la nouvelle architecture d'animation.

## Pourquoi cette refactorisation ?

L'ancien système d'animation, basé sur le composant `AnimatedElement`, avait plusieurs limitations :

- Difficile d'ajouter de nouveaux types d'animation
- Pas de séparation claire entre la logique d'animation et le rendu
- Architecture monolithique compliquant les tests et la maintenance
- Mauvaise intégration avec Barba.js pour les transitions de page

## Bénéfices de la nouvelle architecture

- Structure modulaire avec composants spécifiques pour chaque type d'animation
- Meilleure intégration avec Barba.js et Zustand
- API programmable via le hook `useAnimation`
- Meilleure séparation des préoccupations

## Étapes de migration

### 1. Remplacer l'import générique par des composants spécifiques

**Avant** :

```tsx
import AnimatedElement, { AnimationType } from '../AnimatedElement'
```

**Après** :

```tsx
import { Fade, SlideUp, SlideDown } from '@/lib/animations'
```

### 2. Utilisation des composants spécifiques au lieu du composant générique

**Avant** :

```tsx
<AnimatedElement
  type={AnimationType.SLIDE_UP}
  delay={0.2}
  className="my-class"
  customParams={{
    fromY: -100,
    duration: 0.8,
    ease: 'power3.out',
  }}
>
  Contenu à animer
</AnimatedElement>
```

**Après** :

```tsx
<SlideUp delay={0.2} className="my-class" distance={100}>
  Contenu à animer
</SlideUp>
```

### 3. Utilisation avancée : Hook useAnimation

Pour des cas plus complexes, vous pouvez utiliser le hook dédié :

```tsx
import { useAnimation } from '@/lib/animations'
import { AnimationType } from '@/hooks/useAnimation'
import { useRef, useEffect } from 'react'

function MyComponent() {
  const { animateElement, stopAnimation } = useAnimation()
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (elementRef.current) {
      animateElement(
        elementRef.current,
        'slideUp',
        { duration: 1, delay: 0.2, fromY: -100 },
        () => console.log('Animation terminée')
      )
    }

    return () => {
      if (elementRef.current) {
        stopAnimation(elementRef.current)
      }
    }
  }, [])

  return <div ref={elementRef}>Contenu à animer programmatiquement</div>
}
```

### 4. Ajouter un nouveau type d'animation

Pour ajouter une nouvelle animation, créez un nouveau composant dans `src/lib/animations/components/` :

```tsx
import BaseAnimation, { BaseAnimationProps } from './BaseAnimation'

export interface MyNewAnimationProps extends BaseAnimationProps {
  // Propriétés spécifiques à cette animation
  intensity?: number
}

export default function MyNewAnimation({
  intensity = 1,
  ...props
}: MyNewAnimationProps) {
  return (
    <BaseAnimation
      {...props}
      animationName="myNewAnimation"
      getInitialParams={() => ({
        opacity: 0,
        // autres paramètres initiaux
      })}
      getAnimationParams={(isExit = false, delay = 0) => ({
        opacity: isExit ? 0 : 1,
        // autres paramètres d'animation
        duration: 0.8 * intensity,
        ease: 'power3.out',
        delay: isExit ? 0 : delay,
      })}
    />
  )
}
```

Puis exportez-le dans `src/lib/animations/components/index.ts` :

```tsx
// ... autres exports
export { default as MyNewAnimation } from './MyNewAnimation'
export type { MyNewAnimationProps } from './MyNewAnimation'
```

### 5. Adapter pour Barba.js

L'intégration avec Barba.js reste simple :

```tsx
<SlideUp
  playExitAnimation={true}
  entrancePatterns={['/projects']}
  exitPatterns={['/projects']}
  playOnceOnly={false}
>
  Contenu avec animation d'entrée/sortie
</SlideUp>
```

## Important

Le système utilise maintenant des composants spécifiques pour chaque type d'animation, offrant une API plus intuitive et des propriétés dédiées à chaque effet d'animation.
