'use client'

import { useEffect } from 'react'
import PageTransition from '@/components/transitions/PageTransition'
import CloudinaryImage from '@/components/ui/CloudinaryImage'
import AnimatedOverlay from '@/components/ui/AnimatedOverlay'
import { useAnimationStore } from '@/store/animationStore'
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation'

/**
 * Home page with project showcase and animations
 */
export default function Home() {
  const { setLeavingPage, isLeavingPage } = useAnimationStore()
  const { navigateWithTransition } = useTransitionNavigation()

  // Reset leaving state on mount
  useEffect(() => {
    setLeavingPage(false)
  }, [setLeavingPage])

  return (
    <PageTransition>
      <div className="h-[calc(100vh-5.5rem)] grid grid-cols-2 gap-16 px-24 py-16 items-center">
        {/* Black & White Project */}
        <div 
          className="relative flex items-center w-full max-w-[450px] mx-auto aspect-[4/3] cursor-pointer overflow-hidden"
          onClick={() => navigateWithTransition('/black-and-white')}
        >
          <CloudinaryImage
            src="cover-bw.jpg"
            alt="Photographie Noir et Blanc"
            width={900}
            height={675}
            className="w-full h-full"
            folder="home"
            fallbackSrc="/images/bw-cover.jpg"
          />
          <AnimatedOverlay
            id="/black-and-white"
            showEntrance={true}
            showExit={isLeavingPage}
            entranceDelay={0}
            exitDelay={0}
          />
        </div>

        {/* Early Color Project */}
        <div 
          className="relative flex items-center w-full max-w-[450px] mx-auto aspect-[4/3] cursor-pointer overflow-hidden"
          onClick={() => navigateWithTransition('/early-color')}
        >
          <CloudinaryImage
            src="cover-color.jpg"
            alt="Photographie Couleur"
            width={900}
            height={675}
            className="w-full h-full"
            folder="home"
            fallbackSrc="/images/color-cover.jpg"
          />
          <AnimatedOverlay
            id="/early-color"
            showEntrance={true}
            showExit={isLeavingPage}
            entranceDelay={1}
            exitDelay={0.6}
          />
        </div>
      </div>
    </PageTransition>
  )
}