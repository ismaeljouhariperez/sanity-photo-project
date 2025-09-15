'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface TouchFeedbackProps {
  children: ReactNode
  className?: string
  scale?: number
  duration?: number
  disabled?: boolean
}

/**
 * Touch feedback component for better mobile interactions
 * Provides subtle scale and opacity feedback on touch
 */
export default function TouchFeedback({ 
  children, 
  className = '', 
  scale = 0.95,
  duration = 0.1,
  disabled = false 
}: TouchFeedbackProps) {
  if (disabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      whileTap={{ 
        scale,
        opacity: 0.8,
        transition: { duration }
      }}
      style={{ touchAction: 'manipulation' }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Hook for consistent touch feedback variants
 */
export const touchFeedbackVariants = {
  tap: {
    scale: 0.95,
    opacity: 0.8,
    transition: { duration: 0.1 }
  },
  subtle: {
    scale: 0.98,
    opacity: 0.9,
    transition: { duration: 0.15 }
  },
  button: {
    scale: 0.92,
    opacity: 0.7,
    transition: { duration: 0.1 }
  }
}