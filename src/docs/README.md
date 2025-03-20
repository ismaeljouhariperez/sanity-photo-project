# Système d'Animation

Un système d'animation modulaire et extensible pour projets React, compatible avec Next.js, Barba.js et Zustand.

## Architecture

Le système d'animation est organisé de la manière suivante :

```
src/
├── lib/
│   └── animations/
│       ├── components/              # Composants d'animation spécifiques
│       │   ├── BaseAnimation.tsx    # Composant de base pour toutes les animations
│       │   ├── FadeAnimation.tsx    # Animation de fondu
│       │   ├── SlideUpAnimation.tsx # Animation de glissement vers le haut
│       │   └── ...                  # Autres types d'animations
│       ├── types.ts                 # Types et interfaces partagés
│       └── index.ts                 # Point d'entrée exportant tous les composants
└── hooks/
    ├── useAnimation.ts              # Hook pour animations programmables
    └── useServices.ts               # Hook pour accéder aux services d'animation
```

## Caractéristiques

- **Composants spécifiques** : Un composant dédié pour chaque type d'animation
- **Hook programmable** : Un hook `useAnimation` pour les animations contrôlées par code
- **Types extensibles** : Facilement extensible avec de nouveaux types d'animations
- **Intégration Barba.js** : Support complet des transitions entre pages avec Barba.js
- **Gestion d'état** : Intégration transparente avec Zustand pour la gestion de l'état des animations

## Utilisation

### Composants d'animation

```tsx
import { SlideUp, Fade } from '@/lib/animations'

function MyComponent() {
  return (
    <>
      <SlideUp delay={0.2} className="my-element" distance={100}>
        Contenu avec effet de glissement vers le haut
      </SlideUp>

      <Fade delay={0.4} className="my-element" playExitAnimation={true}>
        Contenu avec effet de fondu
      </Fade>
    </>
  )
}
```

### Hook useAnimation

```tsx
import { useAnimation } from '@/lib/animations'
import { AnimationType } from '@/hooks/useAnimation'
import { useRef, useEffect } from 'react'

function MyComponent() {
  const { animateElement, stopAnimation } = useAnimation()
  const elementRef = useRef<HTMLDivElement>(null)

  const triggerAnimation = () => {
    if (elementRef.current) {
      animateElement(elementRef.current, 'slideUp', {
        duration: 0.8,
        fromY: -100,
        ease: 'power3.out',
      })
    }
  }

  return (
    <>
      <div ref={elementRef} className="my-element">
        Contenu à animer programmatiquement
      </div>
      <button onClick={triggerAnimation}>Animer</button>
    </>
  )
}
```

## Types d'animations disponibles

- `Fade` : Effet de fondu
- `SlideUp` : Glissement vers le haut
- `SlideDown` : Glissement vers le bas
- `SlideLeft` : Glissement vers la gauche
- `SlideRight` : Glissement vers la droite
- `Scale` : Effet de mise à l'échelle
- `Title` : Animation spéciale pour les titres

## Créer un nouveau type d'animation

1. Créer un nouveau fichier dans `src/lib/animations/components/` (ex: `MyNewAnimation.tsx`)
2. Étendre le composant `BaseAnimation` avec les paramètres spécifiques
3. Exporter le composant dans `src/lib/animations/components/index.ts`

```tsx
// MyNewAnimation.tsx
import BaseAnimation, { BaseAnimationProps } from './BaseAnimation'

export interface MyNewAnimationProps extends BaseAnimationProps {
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
        // Autres paramètres initiaux
      })}
      getAnimationParams={(isExit = false, delay = 0) => ({
        opacity: isExit ? 0 : 1,
        // Autres paramètres d'animation
        duration: 0.8 * intensity,
        ease: 'power3.out',
        delay: isExit ? 0 : delay,
      })}
    />
  )
}
```

## Bonnes pratiques

1. Utilisez les composants spécifiques (`Fade`, `SlideUp`, etc.) pour la majorité des cas
2. Réservez le hook `useAnimation` pour les animations complexes ou dynamiques
3. Pour les animations de transition de page, utilisez les props `playExitAnimation`, `entrancePatterns` et `exitPatterns`
4. Gardez les animations cohérentes avec le design de votre application
