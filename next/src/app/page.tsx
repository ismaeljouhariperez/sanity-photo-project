'use client'

import { useState, startTransition } from 'react'
import { CATEGORIES, CategoryType } from '@/lib/constants'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTransitionStore } from '@/store/animationStore'
import ImageReveal from '@/components/ui/media/ImageReveal'

/**
 * Home page with clean image reveal animations
 * Following Next.js 15+ and Framer Motion best practices
 */
export default function Home() {
  const router = useRouter()
  const { setTransition } = useTransitionStore()
  const [isExiting, setIsExiting] = useState(false)
  const [pendingPath, setPendingPath] = useState<string | null>(null)

  const handleNavigate = (path: `/${CategoryType}`) => {
    setIsExiting(true)
    setTransition(true, 'exiting')
    setPendingPath(path)
  }

  const handleExitComplete = () => {
    if (pendingPath && isExiting) {
      // Use startTransition for better React 18+ navigation
      startTransition(() => {
        router.push(pendingPath as `/${string}`)
      })
    }
  }

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.15, // Faster for better FCP
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2, // Quick container fade
        ease: [0.16, 1, 0.3, 1] as const,
        delay: 0.65, // Wait for second image: 0.15s exitDelay + 0.5s animation duration
      },
    },
  }

  return (
    <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
      <motion.div
        key={isExiting ? "exiting" : "home-content"}
        variants={containerVariants}
        initial="initial"
        animate={isExiting ? "exit" : "animate"}
        exit="exit"
        className="container mx-auto flex h-full items-center px-4 md:px-8"
      >
          <div className="grid w-full grid-cols-1 place-items-center gap-12 md:grid-cols-2 md:gap-8">
            {/* Black & White Project - LCP candidate */}
            <ImageReveal
              src="cover-bw.jpg"
              alt="Photographie Noir et Blanc"
              width={1200}
              height={975}
              folder="home"
              fallbackSrc="/images/bw-cover.jpg"
              priority={true}
              onClick={() => handleNavigate(`/${CATEGORIES.MONOCHROME}`)}
              delay={0} // No delay for LCP optimization
              exitDelay={0}
              isExiting={isExiting}
              className="md:max-w-[70%]"
            />

            {/* Early Color Project - Priority for LCP */}
            <ImageReveal
              src="cover-color.jpg"
              alt="Photographie Couleur"
              width={1200}
              height={975}
              folder="home"
              fallbackSrc="/images/color-cover.jpg"
              priority={true}
              onClick={() => handleNavigate(`/${CATEGORIES.EARLY_COLOR}`)}
              delay={0.4}
              exitDelay={0.15}
              isExiting={isExiting}
              className="md:max-w-[70%]"
            />
          </div>
      </motion.div>
    </AnimatePresence>
  )
}
