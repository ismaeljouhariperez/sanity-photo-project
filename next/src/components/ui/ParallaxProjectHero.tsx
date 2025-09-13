'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import type { Project } from '@/lib/sanity.types'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import {
  useScrollProgress,
  useParallaxTransform,
} from '@/hooks/useScrollProgress'

interface ParallaxProjectHeroProps {
  project: Project
}

export default function ParallaxProjectHero({
  project,
}: ParallaxProjectHeroProps) {
  const { shouldDisableParallax } = useReducedMotion()

  // Use custom hook for proper hydration handling
  const { ref: heroRef, scrollYProgress } = useScrollProgress({
    offset: ['start start', 'end start'],
  })

  // Parallax transforms with conditional values
  const imageY = useParallaxTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '50%'],
    shouldDisableParallax
  )
  const textY = useParallaxTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '25%'],
    shouldDisableParallax
  )
  const opacity = useParallaxTransform(
    scrollYProgress,
    [0, 0.8],
    ['1', '0'],
    shouldDisableParallax
  )

  if (!project.images || project.images.length === 0) {
    return null
  }

  const featuredImage = project.images[0]

  return (
    <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
      {/* Parallax Background Image */}
      <motion.div
        style={{ y: imageY }}
        className="absolute inset-0 scale-110" // Scale up to prevent gaps during parallax
      >
        <Image
          src={urlFor(featuredImage.image)
            .width(1920)
            .height(1080)
            .quality(90)
            .url()}
          alt={featuredImage.title || project.title || 'Featured image'}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* Parallax Text Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="container mx-auto px-4 text-center text-white">
          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center text-white/80">
              <span className="mb-2 text-lg">Faire défiler</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="h-6 w-px bg-white/60"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
