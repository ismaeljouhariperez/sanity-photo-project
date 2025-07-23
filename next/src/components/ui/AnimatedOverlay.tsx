'use client'

import { motion, AnimatePresence } from 'framer-motion'

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
  /** Animation speed for entrance (in seconds) */
  entranceSpeed?: number
  /** Animation speed for exit (in seconds) */
  exitSpeed?: number
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
  entranceSpeed = 1.2,
  exitSpeed = 0.5,
  className = 'absolute bottom-0 left-0 w-full bg-gray-50 z-10',
}: AnimatedOverlayProps) {
  // Simple animation variants
  const entranceVariants = {
    initial: { height: '100%', bottom: 0 },
    animate: { 
      height: '0%', 
      bottom: 0,
      transition: { 
        duration: entranceSpeed, 
        ease: [0.16, 1, 0.3, 1] as const,
        delay: entranceDelay 
      }
    },
  }

  const exitVariants = {
    initial: { height: 0, top: 0 },
    animate: { 
      height: '100%', 
      top: 0,
      transition: { 
        duration: exitSpeed, 
        ease: [0.16, 1, 0.3, 1] as const,
        delay: exitDelay 
      }
    },
  }

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