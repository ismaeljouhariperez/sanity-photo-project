'use client'
import React from 'react'
import { motion } from 'framer-motion'
import ImageKitImage from './components/ImageKitImage'
import PageTransition from '@/components/transitions/PageTransition'
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation'

export default function Home() {
  const { navigateTo } = useTransitionNavigation()

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const imageVariants = {
    initial: { opacity: 0, y: 100, scale: 0.9 },
    animate: (custom: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        delay: custom * 0.3,
      },
    }),
    exit: (custom: boolean) => ({
      opacity: 0,
      x: custom ? -100 : 100,
      scale: 0.95,
      transition: {
        duration: 0.7,
      },
    }),
  }

  const handleNavigate = (path: string) => {
    navigateTo(path)
  }

  return (
    <PageTransition>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="h-[calc(100vh-5.5rem)] grid grid-cols-2 gap-4 p-4 items-center justify-items-center"
      >
        <motion.div
          variants={imageVariants}
          custom={0}
          className="relative flex items-center w-80 aspect-[3/4] cursor-pointer overflow-hidden"
          onClick={() => handleNavigate('/projects/black-and-white')}
        >
          <div className="w-full h-full transform hover:scale-105 transition-transform duration-500">
            <ImageKitImage
              src="default-image.jpg"
              alt="Black and White Photography"
              width={800}
              height={600}
              className="object-cover w-full h-full"
            />
          </div>
        </motion.div>

        <motion.div
          variants={imageVariants}
          custom={1}
          className="relative flex items-center w-80 aspect-[3/4] cursor-pointer overflow-hidden"
          onClick={() => handleNavigate('/projects/early-color')}
        >
          <div className="w-full h-full transform hover:scale-105 transition-transform duration-500">
            <ImageKitImage
              src="default-image.jpg"
              alt="Early Color Photography"
              width={800}
              height={600}
              className="object-cover w-full h-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </PageTransition>
  )
}
