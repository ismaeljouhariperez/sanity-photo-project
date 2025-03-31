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
    animate: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3,
      },
    },
    exit: { opacity: 0 },
  }

  const imageVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
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
        className="h-[calc(100vh-5.5rem)] grid grid-cols-2 gap-16 px-24 py-16 items-center"
      >
        <motion.div
          variants={imageVariants}
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
        </motion.div>

        <motion.div
          variants={imageVariants}
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
        </motion.div>
      </motion.div>
    </PageTransition>
  )
}
