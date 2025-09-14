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

  // Loading or no data state - could add a loading spinner here
  return null
})

const GalleryOverlay = memo(function GalleryOverlay({ isOpen, onClose, project }: GalleryOverlayProps) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && <GalleryWithData key="gallery-overlay" project={project} onClose={onClose} />}
    </AnimatePresence>
  )
})

export default GalleryOverlay
