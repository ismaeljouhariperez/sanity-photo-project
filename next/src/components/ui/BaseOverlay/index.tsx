'use client'

import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BaseOverlayProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  zIndex?: string
}

const BaseOverlay = memo(function BaseOverlay({
  isOpen,
  onClose,
  children,
  className = 'bg-cream',
  zIndex = 'z-40'
}: BaseOverlayProps) {
  // Smooth overlay animations (same as MenuOverlay)
  const overlayVariants = {
    hidden: {
      y: '-100%',
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        delay: 0.2,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.8,
        delay: 0.15,
        ease: [0.7, 0, 0.84, 0] as const,
      },
    },
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className={`fixed inset-0 ${zIndex} flex items-center justify-center ${className}`}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <div
            className="container mx-auto max-h-screen overflow-y-auto px-6 py-20"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

export default BaseOverlay