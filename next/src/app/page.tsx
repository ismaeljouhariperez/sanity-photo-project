'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePageTransition } from '@/hooks/usePageTransition'
import ImageReveal from '@/components/ui/media/ImageReveal'

/**
 * Home page with clean image reveal animations
 * Following Next.js 15.5 and React 19 best practices
 */
export default function Home() {
  const { navigateWithTransition, isExiting } = usePageTransition()

  const handleNavigate = (path: string) => {
    navigateWithTransition(path)
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
            width={1200}
            height={975}
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
            width={1200}
            height={975}
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
