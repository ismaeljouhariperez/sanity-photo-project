'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import CloudinaryImage from '@/components/ui/CloudinaryImage'
import AnimatedOverlay from '@/components/ui/AnimatedOverlay'
import { useAnimationStore } from '@/store/animationStore'
import { useRouter } from 'next/navigation'

/**
 * Home page with project showcase and animations
 */
export default function Home() {
  const { setLeavingPage, isLeavingPage } = useAnimationStore()
  const router = useRouter()
  const [showEntrance, setShowEntrance] = useState(false)

  // Reset leaving state and trigger entrance animation on mount
  useEffect(() => {
    setLeavingPage(false)
    setShowEntrance(true)
  }, [setLeavingPage])

  // Handle navigation with exit animation
  const handleNavigate = (path: string) => {
    setLeavingPage(true)
    
    // Navigate after exit animation completes
    setTimeout(() => {
      router.push(path)
    }, 1000) // Adjust timing to match your exit animation duration
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="h-[calc(100vh-5.5rem)] grid grid-cols-2 gap-16 px-24 py-16 items-center"
    >
        {/* Black & White Project */}
        <div 
          className="relative flex items-center w-full max-w-[450px] mx-auto aspect-[4/3] cursor-pointer overflow-hidden"
          onClick={() => handleNavigate('/black-and-white')}
        >
          <CloudinaryImage
            src="cover-bw.jpg"
            alt="Photographie Noir et Blanc"
            width={900}
            height={675}
            className="w-full h-full"
            folder="home"
            fallbackSrc="/images/bw-cover.jpg"
            priority={true}
          />
          <AnimatedOverlay
            id="/black-and-white"
            showEntrance={showEntrance && !isLeavingPage}
            showExit={isLeavingPage}
            entranceDelay={0}
            exitDelay={0}
          />
        </div>

        {/* Early Color Project */}
        <div 
          className="relative flex items-center w-full max-w-[450px] mx-auto aspect-[4/3] cursor-pointer overflow-hidden"
          onClick={() => handleNavigate('/early-color')}
        >
          <CloudinaryImage
            src="cover-color.jpg"
            alt="Photographie Couleur"
            width={900}
            height={675}
            className="w-full h-full"
            folder="home"
            fallbackSrc="/images/color-cover.jpg"
            priority={true}
          />
          <AnimatedOverlay
            id="/early-color"
            showEntrance={showEntrance && !isLeavingPage}
            showExit={isLeavingPage}
            entranceDelay={1}
            exitDelay={0.6}
          />
        </div>
    </motion.div>
  )
}