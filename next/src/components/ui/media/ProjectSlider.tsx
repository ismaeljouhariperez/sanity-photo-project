'use client'

import { useEffect, useState, useCallback, memo } from 'react'
import { urlFor } from '@/lib/sanity'
import type { Project } from '@/lib/sanity.types'
import useEmblaCarousel from 'embla-carousel-react'
import { easeInOut, motion } from 'framer-motion'
import Image from 'next/image'
import { useSimpleCursor } from '@/hooks/useSimpleCursor'
import { useCurrentProjectStore } from '@/store/currentProjectStore'
import { useImageNavigationStore } from '@/store/imageNavigationStore'
import TextSlide from './TextSlide'

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

  // Detect if device supports touch for responsive config
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // Set project in store when component mounts
  useEffect(() => {
    setProject(project)

    // Clear project when component unmounts
    return () => setProject(null)
  }, [project, setProject])

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex: 0,
    // Enable touch/swipe while maintaining fade effect
    dragFree: false,
    watchDrag: true, // Enable touch interactions
    duration: 0, // No slide animation (fade effect)
    // Mobile-optimized settings
    skipSnaps: false,
    dragThreshold: 10, // Lower threshold for easier swipes
    inViewThreshold: 0.7, // Better mobile detection
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const { cursorPosition, showCursor } = useSimpleCursor()
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
        style={{ height: 'calc(100vh - var(--header-height))' }}
      >
        <div className="text-gray-500">Aucune photo à afficher</div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: easeInOut, delay: 1 }}
      className="flex h-[80%] w-full flex-col"
    >
      {/* Embla Carousel - responsive touch handling */}
      <div className={`custom-cursor h-full ${isTouchDevice ? 'touch-pan-x' : ''}`}>
        <div className="embla h-full" ref={emblaRef}>
          <div className="embla__container h-full">
            {/* Image slides */}
            {images.map((image, index) => (
              <div
                key={image._key || index}
                className="embla__slide absolute inset-0 flex items-center justify-center"
                style={{
                  opacity: index === selectedIndex ? 1 : 0,
                  transition: 'opacity 0.4s ease-in-out',
                  zIndex: index === selectedIndex ? 1 : 0,
                }}
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
                  loading={index <= 1 ? "eager" : "lazy"}
                />
              </div>
            ))}

            {/* Text slide - final slide */}
            <div
              className="embla__slide absolute inset-0"
              style={{
                opacity: selectedIndex === images.length ? 1 : 0,
                transition: 'opacity 0.4s ease-in-out',
                zIndex: selectedIndex === images.length ? 1 : 0,
              }}
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

      {/* Footer Controls - Mobile/tablet optimized */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 flex justify-center p-4 md:p-6 lg:hidden pb-safe-bottom">
        <div className="flex items-center gap-4 rounded-full bg-white/90 px-4 py-3 backdrop-blur-sm md:gap-6 md:px-6 md:py-4 shadow-lg">
          {/* Image Counter - larger on mobile */}
          <div className="flex items-center gap-2 font-mono text-base text-gray-700 md:text-sm">
            <span className="font-semibold">
              {String(selectedIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-400">
              {String(totalSlides).padStart(2, '0')}
            </span>
          </div>

          {/* Dots Navigation - optimized for touch */}
          <div className="flex items-center gap-3 md:gap-2">
            {/* Image dots (show first 5 images if we have text slide) */}
            {images.slice(0, Math.min(5, images.length)).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`min-h-touch min-w-touch flex items-center justify-center p-2 touch-manipulation transition-colors ${
                  index === selectedIndex
                    ? 'opacity-100'
                    : 'opacity-50 hover:opacity-75 active:opacity-100'
                }`}
              >
                <div className={`h-2 w-2 rounded-full transition-all duration-200 ${
                  index === selectedIndex
                    ? 'bg-black scale-125'
                    : 'bg-black/60'
                }`} />
              </button>
            ))}

            {/* Text slide dot (always show as last dot) */}
            <button
              key="text-slide"
              onClick={() => scrollTo(images.length)}
              className={`min-h-touch min-w-touch flex items-center justify-center p-2 touch-manipulation transition-colors ${
                selectedIndex === images.length
                  ? 'opacity-100'
                  : 'opacity-50 hover:opacity-75 active:opacity-100'
              }`}
            >
              <div className={`h-2 w-2 rounded-full transition-all duration-200 ${
                selectedIndex === images.length
                  ? 'bg-black scale-125'
                  : 'bg-black/60'
              }`} />
            </button>

            {/* Show +N indicator if more than 5 image slides */}
            {images.length > 5 && (
              <span className="ml-2 text-sm text-gray-400 md:text-xs">
                +{images.length - 5}
              </span>
            )}
          </div>
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
