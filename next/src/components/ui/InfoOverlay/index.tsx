'use client'
import { motion, AnimatePresence } from 'framer-motion'

interface InfoOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export default function InfoOverlay({ isOpen, onClose }: InfoOverlayProps) {
  // Simple animation configurations
  const overlayAnimations = {
    initial: {
      width: 0,
    },
    animate: {
      width: '40%',
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: {
      width: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
        delay: 0.2,
      },
    },
  }

  // Content animation with delay
  const contentAnimations = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
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
