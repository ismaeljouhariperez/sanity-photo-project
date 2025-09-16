'use client'

import { memo } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { Project } from '@/lib/sanity.types'
import GalleryContent from './GalleryContent'

interface GalleryOverlayProps {
  isOpen: boolean
  onClose: () => void
  project: Project | null
}

const GalleryWithData = memo(function GalleryWithData({ project, onClose }: { project: Project | null; onClose: () => void }) {
  // Show gallery content if we have project data
  if (project) {
    return <GalleryContent project={project} onClose={onClose} />
  }

  // Minimalistic loading state for gallery overlay
  return (
    <div className="bg-cream fixed inset-0 z-40 flex items-center justify-center" onClick={onClose}>
      <div className="container mx-auto px-4 py-12 md:px-8 md:py-20" onClick={(e) => e.stopPropagation()}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-6 xl:grid-cols-10 2xl:grid-cols-10">
          {/* Gallery skeleton placeholders */}
          {Array.from({ length: 20 }).map((_, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden bg-gray-100 animate-pulse"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200/60 via-gray-100/60 to-gray-200/60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-300 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

const GalleryOverlay = memo(function GalleryOverlay({ isOpen, onClose, project }: GalleryOverlayProps) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && <GalleryWithData key="gallery-overlay" project={project} onClose={onClose} />}
    </AnimatePresence>
  )
})

export default GalleryOverlay
