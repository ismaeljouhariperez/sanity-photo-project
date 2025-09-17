'use client'

import { motion } from 'framer-motion'
import type { Project } from '@/lib/sanity.types'
import SanityImage from '@/components/ui/media/SanityImage'
import { useImageNavigationStore } from '@/store/imageNavigationStore'

interface GalleryContentProps {
  project: Project | null
  onClose: () => void
}

export default function GalleryContent({
  project,
  onClose,
}: GalleryContentProps) {
  const images = project?.images || []
  const setTargetImage = useImageNavigationStore(
    (state) => state.setTargetImage
  )

  const handleImageClick = (index: number) => {
    setTargetImage(index)
    onClose() // Close gallery overlay
  }

  // Animation variants matching MenuOverlay for consistency
  const overlayVariants = {
    hidden: {
      y: '-100%',
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        delay: 0.2,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.8,
        delay: 0.15,
        ease: [0.7, 0, 0.84, 0] as const, // Same smooth exit as MenuOverlay
      },
    },
  }

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.4, // Same timing as MenuOverlay
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1,
        delayChildren: 0,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -10,
      transition: {
        duration: 0.3,
        ease: [0.7, 0, 0.84, 0] as const, // Same exit ease as MenuOverlay
      },
    },
  }

  return (
    <motion.div
      className="bg-cream fixed inset-0 z-40 flex items-center justify-center"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <div
        className="pb-safe-bottom container mx-auto max-h-screen overflow-y-auto px-4 py-12 md:overflow-hidden md:px-8 md:py-20 md:pb-0"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-6 xl:grid-cols-10 2xl:grid-cols-10"
          variants={listVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {images.map((image, index) => (
            <motion.div
              key={image._key || index}
              variants={itemVariants}
              className="group relative aspect-square cursor-pointer touch-manipulation overflow-hidden"
              onClick={() => handleImageClick(index)}
            >
              <SanityImage
                image={image.image}
                alt={`Gallery image ${index + 1}`}
                width={300}
                height={300}
                className="h-full w-full object-contain transition-transform duration-300"
                sizes="(max-width: 768px) 150px, (max-width: 1024px) 200px, 250px"
                quality={75}
                maxRetries={1}
                timeoutMs={600}
                galleryMode={true}
                priority={index < 6} // Only prioritize first 6 images
              />

              {/* Overlay with image number - always visible on mobile, hover on desktop */}
              <div className="absolute inset-0 bg-black/0 transition-all duration-300 md:group-hover:bg-black/20">
                <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
