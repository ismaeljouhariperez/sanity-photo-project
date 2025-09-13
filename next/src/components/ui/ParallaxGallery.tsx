'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import type { Project } from '@/lib/sanity.types'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useRef } from 'react'

interface ParallaxGalleryProps {
  project: Project
}

export default function ParallaxGallery({ project }: ParallaxGalleryProps) {
  if (!project.images || project.images.length <= 1) {
    return null
  }

  const galleryImages = project.images.slice(1) // Skip hero image
  const { shouldDisableParallax } = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Split images into two columns for alternating layout
  const leftColumnImages = galleryImages.filter((_, index) => index % 2 === 0)
  const rightColumnImages = galleryImages.filter((_, index) => index % 2 === 1)

  // Very subtle opposite movement - less dramatic, more elegant
  const leftY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldDisableParallax ? [0, 0] : [-50, 50]
  )

  const rightY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldDisableParallax ? [0, 0] : [50, -50]
  )

  return (
    <section ref={containerRef}>
      <div className="container mx-auto grid grid-cols-1 gap-12 pb-20 md:grid-cols-2">
        {/* Left Column */}
        <motion.div style={{ y: leftY }} className="space-y-48">
          {leftColumnImages.map((image, index) => (
            <div key={image._key || index} className="relative aspect-[4/3]">
              <Image
                src={urlFor(image.image)
                  .width(800)
                  .height(600)
                  .quality(95)
                  .url()}
                alt={image.title || `Gallery image ${index * 2 + 1}`}
                fill
                className="object-cover"
                loading={index < 2 ? 'eager' : 'lazy'}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ))}
        </motion.div>

        {/* Right Column */}
        <motion.div style={{ y: rightY }} className="space-y-32 md:mt-40">
          {rightColumnImages.map((image, index) => (
            <div key={image._key || index} className="relative aspect-[4/3]">
              <Image
                src={urlFor(image.image)
                  .width(800)
                  .height(600)
                  .quality(95)
                  .url()}
                alt={image.title || `Gallery image ${index * 2 + 2}`}
                fill
                className="object-cover"
                loading={index < 2 ? 'eager' : 'lazy'}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
