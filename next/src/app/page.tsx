'use client'

import { useState } from 'react'
import { CATEGORIES, CategoryType } from '@/lib/constants'
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

  const handleNavigate = (path: `/${CategoryType}`) => {
    setIsExiting(true)
    setTransition(true, 'exiting')

    // Wait for exit animation before navigating
    setTimeout(() => {
      router.push(path)
    }, 1000)
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
      opacity: 1,
      transition: {
        duration: 0.15,
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

          {/* Early Color Project - Non-priority for better LCP */}
          <ImageReveal
            src="cover-color.jpg"
            alt="Photographie Couleur"
            width={1200}
            height={975}
            folder="home"
            fallbackSrc="/images/color-cover.jpg"
            priority={false}
            onClick={() => handleNavigate(`/${CATEGORIES.EARLY_COLOR}`)}
            delay={0.4}
            exitDelay={0.2}
            isExiting={isExiting}
            className="md:max-w-[70%]"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
