'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ImageKitImage from './components/ImageKitImage'
import PageTransition from '@/components/transitions/PageTransition'
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation'
import { useAnimationStore } from '@/store/animationStore'
import {
  createEntranceRevealAnimation,
  createExitCoverAnimation,
} from '@/animations/transitions'

/**
 * Composant d'image de projet avec animations d'entrée et de sortie
 */
interface ProjectImageProps {
  path: string
  title: string
  src: string
  entranceDelay?: number
  exitDelay?: number
}

const ProjectImage = ({
  path,
  title,
  src,
  entranceDelay = 0,
  exitDelay = 0,
}: ProjectImageProps) => {
  const { isLeavingPage } = useAnimationStore()
  const [showEntrance, setShowEntrance] = useState(true)
  const handleNavigate = useNavigateToProject()

  // Définition des animations
  const entranceVariants = createEntranceRevealAnimation({
    speed: 'slower',
    ease: 'default',
    delay: entranceDelay,
  })

  const exitVariants = createExitCoverAnimation({
    speed: 'normal',
    ease: 'default',
    delay: exitDelay,
  })

  // Montrer l'animation d'entrée au montage du composant
  useEffect(() => {
    setShowEntrance(true)
  }, [])

  return (
    <motion.div
      className="relative flex items-center w-full max-w-[450px] mx-auto aspect-[4/3] cursor-pointer overflow-hidden"
      onClick={() => handleNavigate(path)}
    >
      <div className="w-full h-full">
        <ImageKitImage
          src={src || 'default-image.jpg'}
          alt={title}
          width={900}
          height={675}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Animation d'entrée */}
      <AnimatePresence>
        {showEntrance && !isLeavingPage && (
          <motion.div
            key={`entrance-${path}`}
            variants={entranceVariants}
            initial="initial"
            animate="animate"
            className="absolute bottom-0 left-0 w-full bg-gray-50 dark:bg-gray-900 z-10"
          />
        )}
      </AnimatePresence>

      {/* Animation de sortie */}
      <AnimatePresence>
        {isLeavingPage && (
          <motion.div
            key={`exit-${path}`}
            variants={exitVariants}
            initial="initial"
            animate="animate"
            className="absolute top-0 left-0 w-full bg-gray-50 dark:bg-gray-900 z-10"
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/**
 * Hook personnalisé pour gérer la navigation avec animation de sortie
 */
function useNavigateToProject() {
  const { navigateWithTransition } = useTransitionNavigation()
  const { setLeavingPage } = useAnimationStore()
  const [targetUrl, setTargetUrl] = useState<string | null>(null)

  // Effectue la navigation une fois l'animation terminée
  useEffect(() => {
    if (targetUrl) {
      const timer = setTimeout(() => {
        navigateWithTransition(targetUrl)
      }, 1000) // Délai réduit pour permettre aux animations de sortie de se terminer

      return () => clearTimeout(timer)
    }
  }, [targetUrl, navigateWithTransition])

  // Fonction pour déclencher la navigation
  const handleNavigate = (path: string) => {
    setLeavingPage(true)
    setTargetUrl(path)
  }

  return handleNavigate
}

/**
 * Page d'accueil avec affichage des projets et animations
 */
export default function Home() {
  const { setLeavingPage } = useAnimationStore()

  // Réinitialiser l'état de sortie au montage
  useEffect(() => {
    setLeavingPage(false)
  }, [setLeavingPage])

  return (
    <PageTransition>
      <div className="h-[calc(100vh-5.5rem)] grid grid-cols-2 gap-16 px-24 py-16 items-center">
        <ProjectImage
          path="/projects/black-and-white"
          title="Black and White Photography"
          src="default-image.jpg"
          entranceDelay={0}
          exitDelay={0}
        />

        <ProjectImage
          path="/projects/early-color"
          title="Early Color Photography"
          src="default-image.jpg"
          entranceDelay={1}
          exitDelay={0.6}
        />
      </div>
    </PageTransition>
  )
}
