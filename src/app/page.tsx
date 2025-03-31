'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ImageKitImage from './components/ImageKitImage'
import PageTransition from '@/components/transitions/PageTransition'
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation'
import { useAnimationStore } from '@/store/animationStore'

export default function Home() {
  const { navigateTo } = useTransitionNavigation()
  const { isLeavingPage, setLeavingPage } = useAnimationStore()
  const [targetUrl, setTargetUrl] = useState<string | null>(null)
  const [showEntrance, setShowEntrance] = useState(true)

  // Déclencher l'animation d'entrée après le montage du composant
  useEffect(() => {
    // Réinitialiser isLeavingPage au cas où il aurait été laissé à true
    setLeavingPage(false)

    // Garantir que l'animation d'entrée est visible
    setShowEntrance(true)
  }, [setLeavingPage])

  // Variantes pour l'animation d'entrée (dévoilement de bas en haut)
  const firstEntranceVariants = {
    initial: {
      height: '100%',
      bottom: 0,
    },
    animate: {
      height: '0%',
      bottom: 0,
      transition: {
        duration: 2,
        ease: [0.45, 0, 0.55, 1],
      },
    },
  }

  const secondEntranceVariants = {
    initial: {
      height: '100%',
      bottom: 0,
    },
    animate: {
      height: '0%',
      bottom: 0,
      transition: {
        duration: 2,
        ease: [0.45, 0, 0.55, 1],
        delay: 1,
      },
    },
  }

  // Variantes pour l'animation de sortie (recouvrement de haut en bas)
  const firstExitVariants = {
    initial: {
      height: 0,
      top: 0,
    },
    animate: {
      height: '100%',
      top: 0,
      transition: {
        duration: 1.2,
        ease: [0.45, 0, 0.55, 1],
      },
    },
  }

  const secondExitVariants = {
    initial: {
      height: 0,
      top: 0,
    },
    animate: {
      height: '100%',
      top: 0,
      transition: {
        duration: 1.2,
        ease: [0.45, 0, 0.55, 1],
        delay: 0.6,
      },
    },
  }

  const handleNavigate = (path: string) => {
    setLeavingPage(true)
    setTargetUrl(path)
  }

  // Effectue la navigation une fois l'animation terminée
  useEffect(() => {
    if (isLeavingPage && targetUrl) {
      const timer = setTimeout(() => {
        navigateTo(targetUrl)
      }, 2100)

      return () => clearTimeout(timer)
    }
  }, [isLeavingPage, targetUrl, navigateTo])

  return (
    <PageTransition>
      <div className="h-[calc(100vh-5.5rem)] grid grid-cols-2 gap-16 px-24 py-16 items-center">
        <motion.div
          className="relative flex items-center w-full max-w-[450px] mx-auto aspect-[4/3] cursor-pointer overflow-hidden"
          onClick={() => handleNavigate('/projects/black-and-white')}
        >
          <div className="w-full h-full">
            <ImageKitImage
              src="default-image.jpg"
              alt="Black and White Photography"
              width={900}
              height={675}
              className="object-cover w-full h-full"
            />
          </div>
          <AnimatePresence>
            {showEntrance && !isLeavingPage && (
              <motion.div
                key="entrance1"
                variants={firstEntranceVariants}
                initial="initial"
                animate="animate"
                className="absolute bottom-0 left-0 w-full bg-white dark:bg-gray-900 z-10"
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isLeavingPage && (
              <motion.div
                key="exit1"
                variants={firstExitVariants}
                initial="initial"
                animate="animate"
                className="absolute top-0 left-0 w-full bg-white dark:bg-gray-900 z-10"
              />
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="relative flex items-center w-full max-w-[450px] mx-auto aspect-[4/3] cursor-pointer overflow-hidden"
          onClick={() => handleNavigate('/projects/early-color')}
        >
          <div className="w-full h-full">
            <ImageKitImage
              src="default-image.jpg"
              alt="Early Color Photography"
              width={900}
              height={675}
              className="object-cover w-full h-full"
            />
          </div>
          <AnimatePresence>
            {showEntrance && !isLeavingPage && (
              <motion.div
                key="entrance2"
                variants={secondEntranceVariants}
                initial="initial"
                animate="animate"
                className="absolute bottom-0 left-0 w-full bg-white dark:bg-gray-900 z-10"
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isLeavingPage && (
              <motion.div
                key="exit2"
                variants={secondExitVariants}
                initial="initial"
                animate="animate"
                className="absolute top-0 left-0 w-full bg-white dark:bg-gray-900 z-10"
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </PageTransition>
  )
}
