'use client'

import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { urlFor } from '@/lib/sanity'
import type { Project } from '@/lib/sanity.types'
import Image from 'next/image'

interface GalleryOverlayProps {
  isOpen: boolean
  onClose: () => void
  project: Project | null
}

const GalleryOverlay = memo(function GalleryOverlay({
  isOpen,
  onClose,
  project,
}: GalleryOverlayProps) {
  const images = project?.images || []

  // Grid stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        when: 'afterChildren',
        staggerChildren: 0.05,
        staggerDirection: -1,
        duration: 0.2,
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
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
    },
  } as const

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="bg-cream fixed inset-0 z-[9998] flex items-center justify-center"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="container mx-auto max-h-screen overflow-y-auto px-6 py-20"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {images.map((image, index) => (
                <motion.div
                  key={image._key || index}
                  variants={itemVariants}
                  className="group relative aspect-square cursor-pointer overflow-hidden bg-gray-100"
                >
                  <Image
                    src={urlFor(image.image)
                      .width(300)
                      .height(300)
                      .quality(80)
                      .url()}
                    alt={`Gallery image ${index + 1}`}
                    width={150}
                    height={150}
                    className="h-full w-full object-cover transition-transform duration-300"
                    sizes="(max-width: 768px) 150px, (max-width: 1024px) 200px, 250px"
                    loading="lazy"
                  />

                  {/* Overlay with image number */}
                  <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20">
                    <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

export default GalleryOverlay
