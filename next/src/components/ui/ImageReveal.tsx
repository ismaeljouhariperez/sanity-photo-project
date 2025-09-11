'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

export default function ImageReveal({
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
  isExiting = false
}: ImageRevealProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Fix hydration by ensuring client-side mount
    setIsMounted(true)
    
    // Trigger entrance animation after mount
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100 + delay * 1000) // Base delay + stagger

    return () => clearTimeout(timer)
  }, [delay])

  // Prevent hydration mismatch - render static version on server
  if (!isMounted) {
    return (
      <div
        className={`relative aspect-[4/3] w-full max-w-[450px] cursor-pointer overflow-hidden ${className}`}
        onClick={onClick}
      >
        <CloudinaryImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-full w-full opacity-0"
          folder={folder}
          fallbackSrc={fallbackSrc}
          priority={priority}
        />
      </div>
    )
  }

  const revealVariants = {
    hidden: {
      clipPath: 'inset(100% 0 0 0)', // Hidden from top
      opacity: 0
    },
    visible: {
      clipPath: 'inset(0% 0 0 0)', // Reveal from top to bottom
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as const,
        clipPath: {
          duration: 1.0,
          ease: [0.16, 1, 0.3, 1] as const
        },
        opacity: {
          duration: 0.3,
          delay: 0.3
        }
      }
    },
    exit: {
      clipPath: 'inset(0 0 100% 0)', // Hide to bottom (reverse)
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
        delay: exitDelay
      }
    }
  }

  // Determine current state based on props and local state
  const getCurrentVariant = () => {
    if (isExiting) return "exit"
    if (isVisible) return "visible"
    return "hidden"
  }

  return (
    <motion.div
      className={`relative aspect-[4/3] w-full max-w-[450px] cursor-pointer overflow-hidden ${className}`}
      onClick={onClick}
      initial="hidden"
      animate={getCurrentVariant()}
      variants={revealVariants}
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
}