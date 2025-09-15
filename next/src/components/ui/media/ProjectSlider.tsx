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
    // Enable slide animation for mobile/tablet only
    duration: isTouchDevice ? 20 : 0,
    // Mobile touch optimizations
    dragFree: false,
    watchDrag: isTouchDevice,
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
      transition={getAnimationConfig({ duration: 1, ease: easeInOut, delay: 1 })}
      className="flex h-[80%] w-full flex-col"
    >
      {/* Touch-friendly carousel container */}
      <div className={`custom-cursor h-full ${isTouchDevice ? 'touch-pan-x' : ''}`}>
        <div className="embla h-full" ref={emblaRef}>
          <div className={`embla__container h-full ${isTouchDevice ? 'flex' : ''}`}>
            {/* Image slides */}
            {images.map((image, index) => (
              <div
                key={image._key || index}
                className={`embla__slide flex items-center justify-center ${
                  isTouchDevice ? 'flex-[0_0_100%]' : 'absolute inset-0'
                }`}
                style={isTouchDevice ? {} : {
                  opacity: index === selectedIndex ? 1 : 0,
                  transition: prefersReducedMotion ? 'opacity 0.1s ease-out' : 'opacity 0.4s ease-in-out',
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
              className={`embla__slide ${
                isTouchDevice ? 'flex-[0_0_100%]' : 'absolute inset-0'
              }`}
              style={isTouchDevice ? {} : {
                opacity: selectedIndex === images.length ? 1 : 0,
                transition: prefersReducedMotion ? 'opacity 0.1s ease-out' : 'opacity 0.4s ease-in-out',
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

      {/* Simple mobile footer */}
      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 lg:hidden">
        <div className="flex items-center gap-2 rounded-full bg-black/20 backdrop-blur-sm px-3 py-1.5">
          {/* Simple dots - show max 7 */}
          {Array.from({ length: Math.min(totalSlides, 7) }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className="touch-manipulation p-1"
            >
              <div 
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === selectedIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50'
                }`} 
              />
            </button>
          ))}
          {/* Show +N if more slides */}
          {totalSlides > 7 && (
            <span className="text-xs text-white/70 ml-1">+{totalSlides - 7}</span>
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
