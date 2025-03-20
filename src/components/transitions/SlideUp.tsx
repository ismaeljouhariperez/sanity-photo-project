'use client'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SlideUpProps {
  children: ReactNode
  delay?: number
  duration?: number
  distance?: number
  className?: string
  isHeader?: boolean
  playExitAnimation?: boolean
  playOnceOnly?: boolean
  entrancePatterns?: string[]
  exitPatterns?: string[]
}

export default function SlideUp({
  children,
  delay = 0,
  duration = 0.5,
  distance = 50,
  className = '',
  isHeader = false,
  playExitAnimation = false,
  playOnceOnly = false,
  entrancePatterns = [],
  exitPatterns = [],
}: SlideUpProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      exit={playExitAnimation ? { opacity: 0, y: -distance } : undefined}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
