'use client'

import { useEffect, useState, useCallback, memo } from 'react'
import { urlFor } from '@/lib/sanity'
import type { Project } from '@/lib/sanity.types'
import useEmblaCarousel from 'embla-carousel-react'
import { easeInOut, motion } from 'framer-motion'
import Image from 'next/image'
import { useSimpleCursor } from '@/hooks/useSimpleCursor'
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations'
import { useCurrentProjectStore } from '@/store/currentProjectStore'
import { useImageNavigationStore } from '@/store/imageNavigationStore'
import TextSlide from './TextSlide'
import styles from './ProjectSlider.module.css'

interface ProjectSliderProps {
  project: Project
}

const ProjectSlider = memo(function ProjectSlider({
  project,
}: ProjectSliderProps) {
  // Set current project in store for other components
  const setProject = useCurrentProjectStore((state) => state.setProject)

  // Image navigation from gallery
  const { targetImageIndex, clearTarget } = useImageNavigationStore()

  // Set project in store when component mounts
  useEffect(() => {
    setProject(project)

    // Clear project when component unmounts
    return () => setProject(null)
  }, [project, setProject])

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex: 0,
    dragFree: false,
    watchDrag: true, // Always enable drag, CSS will handle the layout
    duration: 0, // No slide animation - let CSS handle transitions
    dragThreshold: 15,
    skipSnaps: false,
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const { cursorPosition, showCursor } = useSimpleCursor()
  const { getAnimationConfig, prefersReducedMotion } = useMobileOptimizations()
  const images = project.images || []
  const totalSlides = images.length + 1 // Images + text slide

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    const newIndex = emblaApi.selectedScrollSnap()
    console.log(
      'onSelect - new index:',
      newIndex,
      'can scroll next:',
      emblaApi.canScrollNext(),
      'can scroll prev:',
      emblaApi.canScrollPrev()
    )
    setSelectedIndex(newIndex)
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  // Handle navigation from gallery overlay
  useEffect(() => {
    if (emblaApi && targetImageIndex !== null) {
      console.log('Navigating to image from gallery:', targetImageIndex)
      emblaApi.scrollTo(targetImageIndex)
      clearTarget() // Clear the target after navigation
    }
  }, [emblaApi, targetImageIndex, clearTarget])

  // Simplified - no container registration needed

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      console.log('Scrolling prev from:', selectedIndex)
      emblaApi.scrollPrev()
    }
  }, [emblaApi, selectedIndex])

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      console.log(
        'Scrolling next from:',
        selectedIndex,
        'total images:',
        images.length
      )
      emblaApi.scrollNext()
    }
  }, [emblaApi, selectedIndex, images.length])

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) {
        console.log('Scrolling to:', index)
        emblaApi.scrollTo(index)
      }
    },
    [emblaApi]
  )

  if (images.length === 0) {
    return (
      <div
        className="bg-cream flex w-full items-center justify-center"
        style={{ height: 'calc(100dvh - var(--header-height))' }}
      >
        <div className="text-gray-500">Aucune photo à afficher</div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={getAnimationConfig({
        duration: 1,
        ease: easeInOut,
        delay: 1,
      })}
      className="flex h-full w-full flex-col xl:h-[80%]"
    >
      {/* Touch-friendly carousel container */}
      <div className="custom-cursor h-full touch-pan-x lg:touch-auto">
        <div className="embla h-full" ref={emblaRef}>
          <div className={styles.emblaContainer}>
            {/* Image slides */}
            {images.map((image, index) => (
              <div
                key={image._key || index}
                className={`${styles.emblaSlide} ${index === selectedIndex ? styles.active : ''}`}
              >
                <Image
                  src={urlFor(image.image)
                    .width(1600)
                    .height(1200)
                    .quality(95)
                    .url()}
                  alt={`Image ${index + 1}`}
                  width={1600}
                  height={1200}
                  className="h-full max-h-[80vh] w-auto object-contain"
                  priority={index <= 1}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 80vw"
                  loading={index <= 1 ? 'eager' : 'lazy'}
                />
              </div>
            ))}

            {/* Text slide - final slide */}
            <div
              className={`${styles.emblaSlide} ${selectedIndex === images.length ? styles.active : ''}`}
            >
              <TextSlide project={project} />
            </div>
          </div>
        </div>

        {/* Navigation zones outside embla - modern pattern */}
        <div
          className="absolute left-0 top-0 z-10 h-full w-1/2"
          onClick={scrollPrev}
        />
        <div
          className="absolute right-0 top-0 z-10 h-full w-1/2"
          onClick={scrollNext}
        />
      </div>

      {/* Simple mobile footer */}
      <footer className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 lg:hidden">
        <div className="flex items-center gap-2 rounded-full bg-black/20 px-3 py-1.5 backdrop-blur-sm">
          {/* Simple dots - show max 7 */}
          {Array.from({ length: Math.min(totalSlides, 7) }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className="touch-manipulation p-1"
            >
              <div
                className={`h-1.5 w-1.5 rounded-full transition-all ${
                  index === selectedIndex ? 'scale-125 bg-white' : 'bg-white/50'
                }`}
              />
            </button>
          ))}
          {/* Show +N if more slides */}
          {totalSlides > 7 && (
            <span className="ml-1 text-xs text-white/70">
              +{totalSlides - 7}
            </span>
          )}
        </div>
      </footer>

      {/* Simple Custom Cursor Counter */}
      {showCursor && (
        <div
          className="cursor-counter"
          style={{
            left: cursorPosition.x,
            top: cursorPosition.y,
          }}
        >
          {String(selectedIndex + 1).padStart(2, '0')}/
          {String(totalSlides).padStart(2, '0')}
        </div>
      )}
    </motion.div>
  )
})

export default ProjectSlider
