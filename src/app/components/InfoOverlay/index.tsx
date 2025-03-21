'use client'
import { motion, AnimatePresence } from 'framer-motion'

interface InfoOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export default function InfoOverlay({ isOpen, onClose }: InfoOverlayProps) {
  // Animation variants pour Framer Motion
  const overlayVariants = {
    closed: {
      width: 0,
      transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] },
    },
    open: {
      width: '40%',
      transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] },
    },
  }

  const contentVariants = {
    closed: { opacity: 0, transition: { duration: 0.3 } },
    open: {
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.6,
        ease: [0.6, 0.05, 0.01, 0.9],
      },
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-0 left-0 h-full bg-black z-50 text-white overflow-hidden"
          initial="closed"
          animate="open"
          exit="closed"
          variants={overlayVariants}
        >
          <motion.button
            onClick={onClose}
            className="absolute top-8 right-8 text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            variants={contentVariants}
          >
            Fermer
          </motion.button>

          <motion.div className="mt-16 p-8" variants={contentVariants}>
            <h2 className="text-2xl mb-4">À propos</h2>
            {/* Ajoutez ici votre contenu */}
            <p>Votre contenu ici...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
