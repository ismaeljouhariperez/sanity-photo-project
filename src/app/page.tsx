'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import ImageKitImage from './components/ImageKitImage'

const baseVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 1,
      delay: 0.5,
      ease: 'easeInOut',
    },
  },
}

export default function Home() {
  const router = useRouter()
  const [exitVariant, setExitVariant] = useState('exitDefault')

  const handleNavigate = (path: string) => {
    console.log('Navigation vers:', path)
    const variant = path.includes('black-and-white') ? 'exitLeft' : 'exitRight'
    console.log('Variant choisi:', variant)
    setExitVariant(variant)

    setTimeout(() => {
      console.log('Redirection effectuée')
      router.push(path)
    }, 3000)
  }

  const variants = {
    ...baseVariants,
    exitLeft: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
    exitRight: {
      opacity: 0,
      x: 100,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
    exitDefault: {
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <AnimatePresence mode="wait">
      <div className="h-[calc(100vh-5.5rem)] grid grid-cols-2 gap-4 p-4 items-center justify-items-center">
        <motion.div
          layoutId="bw-image"
          className="relative flex items-center w-80 aspect-[3/4] cursor-pointer"
          variants={variants}
          initial="initial"
          animate="animate"
          exit={exitVariant}
          onAnimationStart={() => console.log('Animation start:', exitVariant)}
          onAnimationComplete={() =>
            console.log('Animation complete:', exitVariant)
          }
          onClick={() => handleNavigate('/projects/black-and-white')}
        >
          <Link href="/projects/black-and-white">
            <ImageKitImage
              src="default-image.jpg"
              alt="Description de l'image"
              width={800}
              height={600}
            />
          </Link>
        </motion.div>

        <motion.div
          layoutId="color-image"
          className="relative flex items-center w-80 aspect-[3/4] cursor-pointer"
          variants={variants}
          initial="initial"
          animate="animate"
          exit={exitVariant}
          onAnimationStart={() => console.log('Animation start:', exitVariant)}
          onAnimationComplete={() =>
            console.log('Animation complete:', exitVariant)
          }
          onClick={() => handleNavigate('/projects/early-color')}
        >
          <Link href="/projects/early-color">
            <ImageKitImage
              src="default-image.jpg"
              alt="Description de l'image"
              width={800}
              height={600}
            />
          </Link>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
