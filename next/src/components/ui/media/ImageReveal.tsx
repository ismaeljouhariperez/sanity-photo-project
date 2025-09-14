'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import CloudinaryImage from './CloudinaryImage'

interface ImageRevealProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  folder?: string
  fallbackSrc?: string
  priority?: boolean
  onClick?: () => void
  delay?: number
  exitDelay?: number
  isExiting?: boolean
}

const ImageReveal = memo(function ImageReveal({
  src,
  alt,
  width,
  height,
  className = '',
  folder,
  fallbackSrc,
  priority = false,
  onClick,
  delay = 0,
  exitDelay = 0,
  isExiting = false,
}: ImageRevealProps) {
  // Simple animation variants - no complex state management
  const revealVariants = {
    hidden: {
      clipPath: 'inset(100% 0 0 0)',
      opacity: 0,
    },
    visible: {
      clipPath: 'inset(0% 0 0 0)',
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as const,
        delay,
        clipPath: {
          duration: 1.0,
          ease: [0.16, 1, 0.3, 1] as const,
          delay,
        },
        opacity: {
          duration: 0.3,
          delay: 0.3, //
        },
      },
    },
    exit: {
      clipPath: 'inset(0 0 100% 0)',
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
        delay: exitDelay,
      },
    },
  } as const

  return (
    <motion.div
      className={`aspect-[4/3] w-full max-w-[70%] cursor-pointer overflow-hidden ${className}`}
      onClick={onClick}
      initial="hidden"
      animate={isExiting ? 'exit' : 'visible'}
      variants={revealVariants}
      suppressHydrationWarning
    >
      <CloudinaryImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-full w-full"
        folder={folder}
        fallbackSrc={fallbackSrc}
        priority={priority}
      />
    </motion.div>
  )
})

export default ImageReveal
