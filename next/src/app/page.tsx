'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTransitionStore } from '@/store/transitionStore'
import ImageReveal from '@/components/ui/media/ImageReveal'

/**
 * Home page with clean image reveal animations
 * Following Next.js 15+ and Framer Motion best practices
 */
export default function Home() {
  const router = useRouter()
  const { setTransition } = useTransitionStore()
  const [isExiting, setIsExiting] = useState(false)

  const handleNavigate = (path: string) => {
    setIsExiting(true)
    setTransition(true, 'exiting')

    // Wait for exit animation before navigating
    setTimeout(() => {
      router.push(path)
    }, 800)
  }

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="container mx-auto flex h-full items-center"
      >
        <div className="grid w-full grid-cols-2 place-items-center gap-8">
          {/* Black & White Project */}
          <ImageReveal
            src="cover-bw.jpg"
            alt="Photographie Noir et Blanc"
            width={900}
            height={675}
            folder="home"
            fallbackSrc="/images/bw-cover.jpg"
            priority={true}
            onClick={() => handleNavigate('/black-and-white')}
            delay={0}
            exitDelay={0}
            isExiting={isExiting}
          />

          {/* Early Color Project */}
          <ImageReveal
            src="cover-color.jpg"
            alt="Photographie Couleur"
            width={900}
            height={675}
            folder="home"
            fallbackSrc="/images/color-cover.jpg"
            priority={true}
            onClick={() => handleNavigate('/early-color')}
            delay={0.4}
            exitDelay={0.2}
            isExiting={isExiting}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
