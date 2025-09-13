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

  // Helper function to detect image orientation
  const getImageOrientation = (image: any) => {
    if (!image.image?.asset?.metadata?.dimensions) return 'landscape'
    
    const { width, height } = image.image.asset.metadata.dimensions
    const aspectRatio = width / height
    
    if (aspectRatio > 1.3) return 'landscape'
    if (aspectRatio < 0.8) return 'portrait'
    return 'square'
  }

  // Create unpredictable layout groups: full-width after 3-5 images randomly
  const layoutGroups: Array<{
    type: 'grid' | 'full'
    images: any[]
    startIndex: number
  }> = []

  // Use project ID as seed for consistent randomness across renders
  const seed = project._id?.slice(-6) || 'default'
  let seedIndex = 0
  const getRandomInterval = () => {
    // Simple seeded random function to ensure consistency
    const char = seed.charCodeAt(seedIndex % seed.length)
    seedIndex++
    return 3 + (char % 3) // Returns 3, 4, or 5
  }

  let currentIndex = 0
  while (currentIndex < galleryImages.length) {
    const interval = getRandomInterval()
    const gridCount = Math.min(interval, galleryImages.length - currentIndex)
    
    // Add grid images
    if (gridCount > 0) {
      const gridImages = galleryImages.slice(currentIndex, currentIndex + gridCount)
      layoutGroups.push({
        type: 'grid',
        images: gridImages,
        startIndex: currentIndex
      })
      currentIndex += gridCount
    }

    // Add full-width image if there are more images remaining
    if (currentIndex < galleryImages.length) {
      const fullImage = galleryImages[currentIndex]
      layoutGroups.push({
        type: 'full',
        images: [fullImage],
        startIndex: currentIndex
      })
      currentIndex += 1
    }
  }

  // Split grid images into columns for each grid group
  const createColumnImages = (images: any[]) => {
    const leftColumnImages = images.filter((_, index) => index % 2 === 0)
    const rightColumnImages = images.filter((_, index) => index % 2 === 1)
    return { leftColumnImages, rightColumnImages }
  }

  // Parallax transforms
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

  const fullImageY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldDisableParallax ? [0, 0] : [-25, 25]
  )

  // Helper function to get aspect ratio class based on orientation
  const getAspectRatioClass = (image: any) => {
    const orientation = getImageOrientation(image)
    switch (orientation) {
      case 'portrait':
        return 'aspect-[3/4]'
      case 'square':
        return 'aspect-square'
      case 'landscape':
      default:
        return 'aspect-[4/3]'
    }
  }

  return (
    <section ref={containerRef}>
      <div className="container mx-auto pb-20">
        {layoutGroups.map((group, groupIndex) => {
          if (group.type === 'grid') {
            const { leftColumnImages, rightColumnImages } = createColumnImages(group.images)
            
            return (
              <div key={`grid-${groupIndex}`} className="grid grid-cols-1 gap-12 mb-48 md:grid-cols-2">
                {/* Left Column */}
                <motion.div style={{ y: leftY }} className="space-y-48">
                  {leftColumnImages.map((image, index) => (
                    <div 
                      key={image._key || `left-${group.startIndex}-${index}`} 
                      className={`relative ${getAspectRatioClass(image)}`}
                    >
                      <Image
                        src={urlFor(image.image)
                          .width(800)
                          .height(600)
                          .quality(95)
                          .url()}
                        alt={image.title || `Gallery image ${group.startIndex + index * 2 + 1}`}
                        fill
                        className="object-cover"
                        loading={groupIndex === 0 && index < 2 ? 'eager' : 'lazy'}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </motion.div>

                {/* Right Column */}
                <motion.div style={{ y: rightY }} className="space-y-32 md:mt-40">
                  {rightColumnImages.map((image, index) => (
                    <div 
                      key={image._key || `right-${group.startIndex}-${index}`} 
                      className={`relative ${getAspectRatioClass(image)}`}
                    >
                      <Image
                        src={urlFor(image.image)
                          .width(800)
                          .height(600)
                          .quality(95)
                          .url()}
                        alt={image.title || `Gallery image ${group.startIndex + index * 2 + 2}`}
                        fill
                        className="object-cover"
                        loading={groupIndex === 0 && index < 2 ? 'eager' : 'lazy'}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </motion.div>
              </div>
            )
          } else {
            // Full-width single image
            const image = group.images[0]
            const orientation = getImageOrientation(image)
            
            return (
              <motion.div 
                key={`full-${groupIndex}`} 
                style={{ y: fullImageY }} 
                className="mb-48"
              >
                <div 
                  className={`relative mx-auto ${
                    orientation === 'landscape' 
                      ? 'aspect-[16/9] max-w-6xl' 
                      : orientation === 'portrait'
                      ? 'aspect-[3/4] max-w-2xl'
                      : 'aspect-square max-w-3xl'
                  }`}
                >
                  <Image
                    src={urlFor(image.image)
                      .width(1200)
                      .height(800)
                      .quality(95)
                      .url()}
                    alt={image.title || `Featured gallery image ${group.startIndex + 1}`}
                    fill
                    className="object-cover"
                    loading={groupIndex < 2 ? 'eager' : 'lazy'}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                </div>
              </motion.div>
            )
          }
        })}
      </div>
    </section>
  )
}
