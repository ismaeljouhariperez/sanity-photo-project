'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { DURATIONS, EASE } from '@/animations'

interface InfoOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export default function InfoOverlay({ isOpen, onClose }: InfoOverlayProps) {
  // Utilisation des constantes d'animation standardisées
  const overlayAnimations = {
    initial: {
      width: 0,
    },
    animate: {
      width: '40%',
      transition: {
        duration: DURATIONS.normal,
        ease: EASE.default,
      },
    },
    exit: {
      width: 0,
      transition: {
        duration: DURATIONS.normal,
        ease: EASE.default,
        delay: DURATIONS.fast,
      },
    },
  }

  // Animation pour les éléments de contenu avec délai
  const contentAnimations = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: DURATIONS.normal,
        delay: 0.6,
        ease: EASE.default,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: DURATIONS.fast,
      },
    },
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed top-0 left-0 h-full bg-black z-50 text-white overflow-hidden"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={overlayAnimations}
        >
          <motion.button
            onClick={onClose}
            className="absolute top-8 right-8 text-white"
            variants={contentAnimations}
          >
            Fermer
          </motion.button>

          <motion.div className="mt-16 p-8" variants={contentAnimations}>
            <h2 className="text-2xl mb-4">À propos</h2>
            {/* Ajoutez ici votre contenu */}
            <p>Votre contenu ici...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
