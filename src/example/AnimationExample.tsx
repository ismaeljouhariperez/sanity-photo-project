'use client'
import { useState, useRef } from 'react'
import { useAnimation, Fade, SlideUp } from '@/lib/animations'
import { AnimationType } from '@/hooks/useAnimation'

/**
 * Composant d'exemple montrant différentes façons d'utiliser le système d'animation
 */
export default function AnimationExample() {
  // État pour contrôler l'affichage des éléments
  const [isVisible, setIsVisible] = useState(true)
  const [currentAnimation, setCurrentAnimation] =
    useState<AnimationType>('fade')

  // Référence pour l'animation programmatique
  const programmaticElementRef = useRef<HTMLDivElement>(null)

  // Hook d'animation
  const { animateElement, stopAnimation, isAnimating } = useAnimation()

  // Fonction pour déclencher une animation programmatique
  const triggerAnimation = () => {
    if (programmaticElementRef.current) {
      animateElement(
        programmaticElementRef.current,
        currentAnimation,
        {
          duration: 0.8,
          fromY: -100,
          fromOpacity: 0,
          fromScale: 0.5,
        },
        () => console.log('Animation terminée')
      )
    }
  }

  // Fonction pour arrêter l'animation
  const handleStopAnimation = () => {
    if (programmaticElementRef.current) {
      stopAnimation(programmaticElementRef.current)
    }
  }

  // Fonction pour rendre le composant d'animation approprié
  const renderAnimationComponent = () => {
    switch (currentAnimation) {
      case 'fade':
        return (
          <>
            <Fade
              delay={0.1}
              className="p-4 mb-4 bg-gray-100 rounded"
              playOnceOnly={false}
            >
              <p>Animation de base avec délai de 0.1s</p>
            </Fade>

            <Fade
              delay={0.3}
              className="p-4 mb-4 bg-gray-200 rounded"
              playOnceOnly={false}
            >
              <p>Animation avec paramètres personnalisés</p>
              <p className="text-sm text-gray-500">
                Duration: 1.2s, Ease: elastic
              </p>
            </Fade>

            <Fade
              delay={0.5}
              className="p-4 bg-gray-300 rounded"
              playOnceOnly={false}
            >
              <p>Animation avec position de départ personnalisée</p>
              <p className="text-sm text-gray-500">FromOpacity: 0.2</p>
            </Fade>
          </>
        )
      case 'slideUp':
        return (
          <>
            <SlideUp
              delay={0.1}
              className="p-4 mb-4 bg-gray-100 rounded"
              playOnceOnly={false}
            >
              <p>Animation de base avec délai de 0.1s</p>
            </SlideUp>

            <SlideUp
              delay={0.3}
              className="p-4 mb-4 bg-gray-200 rounded"
              playOnceOnly={false}
              distance={100}
            >
              <p>Animation avec paramètres personnalisés</p>
              <p className="text-sm text-gray-500">
                Duration: 1.2s, Ease: elastic
              </p>
            </SlideUp>

            <SlideUp
              delay={0.5}
              className="p-4 bg-gray-300 rounded"
              playOnceOnly={false}
              distance={200}
            >
              <p>Animation avec position de départ personnalisée</p>
              <p className="text-sm text-gray-500">Distance: 200px</p>
            </SlideUp>
          </>
        )
      // Cas par défaut
      default:
        return (
          <div className="p-4 bg-yellow-100 rounded">
            <p>Sélectionnez un type d&apos;animation valide</p>
          </div>
        )
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Exemples d&apos;animation</h1>

      {/* Contrôles */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? 'Cacher' : 'Afficher'} les éléments
        </button>

        <select
          className="px-4 py-2 border rounded"
          value={currentAnimation}
          onChange={(e) => setCurrentAnimation(e.target.value as AnimationType)}
        >
          <option value="fade">Fade</option>
          <option value="slideUp">Slide Up</option>
          <option value="slideDown">Slide Down</option>
          <option value="slideLeft">Slide Left</option>
          <option value="slideRight">Slide Right</option>
          <option value="scale">Scale</option>
        </select>

        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={triggerAnimation}
        >
          Déclencher animation
        </button>

        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={handleStopAnimation}
          disabled={!isAnimating}
        >
          Arrêter animation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Exemples avec le composant déclaratif */}
        <div className="border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Approche déclarative</h2>

          {isVisible && renderAnimationComponent()}
        </div>

        {/* Exemples avec l'approche programmatique */}
        <div className="border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Approche programmatique
          </h2>

          <div
            ref={programmaticElementRef}
            className="p-6 bg-blue-100 rounded min-h-[200px] flex flex-col justify-center items-center"
          >
            <p className="text-center mb-2">
              Élément contrôlé programmatiquement
            </p>
            <p className="text-sm text-gray-500 text-center">
              Utilisez les boutons pour déclencher l&apos;animation
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
