'use client'
import React from 'react'
import { motion } from 'framer-motion'
import ImageKitImage from './components/ImageKitImage'
import PageTransition from '@/components/transitions/PageTransition'
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation'
import { createRevealAnimation } from '@/animations/transitions'
import { DEFAULT_ANIMATION_OPTIONS } from '@/animations/constants'

export default function Home() {
  const { navigateTo } = useTransitionNavigation()

  const firstRevealVariants = createRevealAnimation({
    ...DEFAULT_ANIMATION_OPTIONS,
    speed: 'slower',
    ease: 'default',
  })

  const secondRevealVariants = createRevealAnimation({
    ...DEFAULT_ANIMATION_OPTIONS,
    speed: 'slower',
    ease: 'default',
    delay: 1,
  })

  const handleNavigate = (path: string) => {
    navigateTo(path)
  }

  return (
    <PageTransition>
      <div className="h-[calc(100vh-5.5rem)] grid grid-cols-2 gap-16 px-24 py-16 items-center">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="relative flex items-center w-full max-w-[450px] mx-auto aspect-[4/3] cursor-pointer overflow-hidden"
          onClick={() => handleNavigate('/projects/black-and-white')}
        >
          <div className="w-full h-full">
            <ImageKitImage
              src="default-image.jpg"
              alt="Black and White Photography"
              width={900}
              height={675}
              className="object-cover w-full h-full"
            />
          </div>
          <motion.div
            variants={firstRevealVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute bottom-0 left-0 w-full bg-white"
          />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="relative flex items-center w-full max-w-[450px] mx-auto aspect-[4/3] cursor-pointer overflow-hidden"
          onClick={() => handleNavigate('/projects/early-color')}
        >
          <div className="w-full h-full">
            <ImageKitImage
              src="default-image.jpg"
              alt="Early Color Photography"
              width={900}
              height={675}
              className="object-cover w-full h-full"
            />
          </div>
          <motion.div
            variants={secondRevealVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute bottom-0 left-0 w-full bg-white"
          />
        </motion.div>
      </div>
    </PageTransition>
  )
}
