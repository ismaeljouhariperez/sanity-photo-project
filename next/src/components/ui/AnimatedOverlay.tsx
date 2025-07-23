'use client'

import { motion, AnimatePresence, Variants } from 'framer-motion'
import { AnimationOptions } from '@/animations/types'
import {
  createEntranceRevealAnimation,
  createExitCoverAnimation,
} from '@/animations/transitions'

interface AnimatedOverlayProps {
  /** Unique identifier for the overlay */
  id: string
  /** Whether to show the entrance animation */
  showEntrance: boolean
  /** Whether to show the exit animation */
  showExit: boolean
  /** Delay for entrance animation in seconds */
  entranceDelay?: number
  /** Delay for exit animation in seconds */
  exitDelay?: number
  /** Animation options for entrance */
  entranceOptions?: AnimationOptions
  /** Animation options for exit */
  exitOptions?: AnimationOptions
  /** CSS classes for styling */
  className?: string
}

/**
 * AnimatedOverlay component handles entrance and exit animations
 * Single responsibility: manages overlay animations only
 */
export default function AnimatedOverlay({
  id,
  showEntrance,
  showExit,
  entranceDelay = 0,
  exitDelay = 0,
  entranceOptions = { speed: 'slower', ease: 'default' },
  exitOptions = { speed: 'normal', ease: 'default' },
  className = 'absolute bottom-0 left-0 w-full bg-gray-50 z-10',
}: AnimatedOverlayProps) {
  // Create animation variants
  const entranceVariants = createEntranceRevealAnimation({
    ...entranceOptions,
    delay: entranceDelay,
  })

  const exitVariants = createExitCoverAnimation({
    ...exitOptions,
    delay: exitDelay,
  })

  return (
    <>
      {/* Entrance Animation */}
      <AnimatePresence>
        {showEntrance && (
          <motion.div
            key={`entrance-${id}`}
            variants={entranceVariants}
            initial="initial"
            animate="animate"
            className={className}
          />
        )}
      </AnimatePresence>

      {/* Exit Animation */}
      <AnimatePresence>
        {showExit && (
          <motion.div
            key={`exit-${id}`}
            variants={exitVariants}
            initial="initial"
            animate="animate"
            className={className.replace('bottom-0', 'top-0')}
          />
        )}
      </AnimatePresence>
    </>
  )
}