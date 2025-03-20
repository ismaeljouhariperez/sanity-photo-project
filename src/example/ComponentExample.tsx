'use client'
import { useState, useRef } from 'react'
import {
  Fade,
  SlideUp,
  SlideDown,
  SlideLeft,
  SlideRight,
  Scale,
  Title,
} from '@/lib/animations'
import { useAnimation } from '@/hooks/useAnimation'

/**
 * Exemple d'utilisation des composants d'animation
 */
export default function ComponentExample() {
  const [isVisible, setIsVisible] = useState(true)

  // Référence pour l'animation programmatique
  const programmaticRef = useRef<HTMLDivElement>(null)
  const { animateElement, stopAnimation } = useAnimation()

  // Fonction pour animer programmatiquement
  const animateProgrammatically = (
    type:
      | 'fade'
      | 'slideUp'
      | 'slideDown'
      | 'slideLeft'
      | 'slideRight'
      | 'scale'
  ) => {
    if (programmaticRef.current) {
      animateElement(
        programmaticRef.current,
        type,
        { duration: 1, delay: 0.2 },
        () => console.log(`Animation ${type} terminée`)
      )
    }
  }

  // Fonction pour arrêter l'animation
  const handleStopAnimation = () => {
    if (programmaticRef.current) {
      stopAnimation(programmaticRef.current)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Title className="text-3xl font-bold mb-6" delay={0.1}>
        Exemples de composants d&apos;animation
      </Title>

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded mb-8"
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? 'Masquer' : 'Afficher'} les éléments
      </button>

      {isVisible && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Fade className="p-4 bg-purple-100 rounded" delay={0.1}>
              <h2 className="text-xl font-semibold mb-2">Fade</h2>
              <p>Animation simple de fondu</p>
            </Fade>

            <SlideUp
              className="p-4 bg-blue-100 rounded"
              delay={0.2}
              distance={100}
            >
              <h2 className="text-xl font-semibold mb-2">Slide Up</h2>
              <p>Glissement vers le haut (distance: 100px)</p>
            </SlideUp>

            <SlideDown
              className="p-4 bg-green-100 rounded"
              delay={0.3}
              distance={80}
            >
              <h2 className="text-xl font-semibold mb-2">Slide Down</h2>
              <p>Glissement vers le bas (distance: 80px)</p>
            </SlideDown>
          </div>

          <div className="space-y-4">
            <SlideLeft
              className="p-4 bg-yellow-100 rounded"
              delay={0.4}
              distance={120}
            >
              <h2 className="text-xl font-semibold mb-2">Slide Left</h2>
              <p>Glissement vers la gauche (distance: 120px)</p>
            </SlideLeft>

            <SlideRight
              className="p-4 bg-red-100 rounded"
              delay={0.5}
              distance={120}
            >
              <h2 className="text-xl font-semibold mb-2">Slide Right</h2>
              <p>Glissement vers la droite (distance: 120px)</p>
            </SlideRight>

            <Scale
              className="p-4 bg-indigo-100 rounded"
              delay={0.6}
              fromScale={0.5}
              toScale={1}
              playOnceOnly={false}
            >
              <h2 className="text-xl font-semibold mb-2">Scale</h2>
              <p>Animation d&apos;échelle (fromScale: 0.5, toScale: 1)</p>
            </Scale>
          </div>
        </div>
      )}

      {/* Exemple d'animation programmatique */}
      <div className="mt-8 p-6 border rounded">
        <h2 className="text-xl font-semibold mb-4">Animation programmatique</h2>

        <div
          ref={programmaticRef}
          className="p-6 bg-gray-100 rounded mb-4 min-h-[100px] flex items-center justify-center"
        >
          <p>
            Cliquez sur un bouton pour animer cet élément programmatiquement
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => animateProgrammatically('fade')}
            className="px-3 py-1 bg-purple-500 text-white rounded"
          >
            Fade
          </button>
          <button
            onClick={() => animateProgrammatically('slideUp')}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Slide Up
          </button>
          <button
            onClick={() => animateProgrammatically('slideDown')}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Slide Down
          </button>
          <button
            onClick={() => animateProgrammatically('slideLeft')}
            className="px-3 py-1 bg-yellow-500 text-white rounded"
          >
            Slide Left
          </button>
          <button
            onClick={() => animateProgrammatically('slideRight')}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Slide Right
          </button>
          <button
            onClick={() => animateProgrammatically('scale')}
            className="px-3 py-1 bg-indigo-500 text-white rounded"
          >
            Scale
          </button>
          <button
            onClick={handleStopAnimation}
            className="px-3 py-1 bg-gray-500 text-white rounded"
          >
            Stop
          </button>
        </div>
      </div>

      <div className="mt-8 p-6 border rounded">
        <h2 className="text-xl font-semibold mb-4">
          Avantages des composants spécifiques
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Noms descriptifs qui expriment clairement leur fonction</li>
          <li>
            Paramètres spécifiques pour chaque type d&apos;animation (distance,
            échelle, etc.)
          </li>
          <li>API plus intuitive et facile à utiliser</li>
          <li>Code plus modulaire et maintenable</li>
          <li>Facilité d&apos;extension pour ajouter de nouveaux types</li>
        </ul>
      </div>
    </div>
  )
}
