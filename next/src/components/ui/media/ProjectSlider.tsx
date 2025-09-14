'use client'

import { useEffect, useState, useCallback, memo } from 'react'
import { urlFor } from '@/lib/sanity'
import type { Project } from '@/lib/sanity.types'
import useEmblaCarousel from 'embla-carousel-react'
import { easeInOut, motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useCustomCursor } from '@/hooks/useCustomCursor'

interface ProjectSliderProps {
  project: Project
}

const ProjectSlider = memo(function ProjectSlider({ project }: ProjectSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex: 0,
    containScroll: 'trimSnaps',
    duration: 0, // Disable Embla's slide animation
    dragFree: true, // Enable drag for mobile/tablet
    watchDrag: true, // Enable drag for mobile/tablet
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const { 
    cursorPosition, 
    showCursor, 
    handleMouseMove, 
    handleMouseEnter, 
    handleMouseLeave 
  } = useCustomCursor()
  const images = project.images || []

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
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

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index)
    },
    [emblaApi]
  )


  if (images.length === 0) {
    return (
      <div
        className="bg-cream flex items-center justify-center"
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
      className="flex w-full flex-col"
      style={{ height: 'calc(100vh - var(--header-height))' }}
    >
      {/* Embla Carousel with fade transitions */}
      <div 
        className="h-full custom-cursor touch-pan-x"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="embla h-full" ref={emblaRef}>
          <div className="embla__container h-full">
            {images.map((image, index) => (
              <div
                key={image._key || index}
                className="embla__slide relative flex items-center justify-center"
              >
                {/* Left click zone for previous */}
                <div
                  className="absolute left-0 top-0 z-10 h-full w-1/2"
                  onClick={scrollPrev}
                />
                {/* Right click zone for next */}
                <div
                  className="absolute right-0 top-0 z-10 h-full w-1/2"
                  onClick={scrollNext}
                />

                <AnimatePresence mode="wait">
                  {index === selectedIndex && (
                    <motion.div
                      key={`image-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: easeInOut }}
                      className="relative max-h-[80vh] max-w-full"
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
                        className="h-full max-h-full w-auto object-contain"
                        priority={index === 0}
                        sizes="100vw"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Controls - Hidden on desktop, optimized for mobile/tablet */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 flex justify-center p-4 md:p-6 lg:hidden">
        <div className="flex items-center gap-4 md:gap-6 rounded-full px-4 py-2 md:px-6 md:py-3 backdrop-blur-sm bg-white/80">
          {/* Image Counter - larger on mobile */}
          <div className="flex items-center gap-2 font-mono text-base md:text-sm text-gray-700">
            <span className="font-semibold">{String(selectedIndex + 1).padStart(2, '0')}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-400">
              {String(images.length).padStart(2, '0')}
            </span>
          </div>

          {/* Dots Navigation - larger touch targets */}
          <div className="flex items-center gap-3 md:gap-2">
            {images.slice(0, 6).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-3 w-3 md:h-2 md:w-2 rounded-full transition-colors touch-manipulation ${
                  index === selectedIndex
                    ? 'bg-black'
                    : 'bg-black/30 hover:bg-black/50 active:bg-black/70'
                }`}
              />
            ))}
            {images.length > 6 && (
              <span className="ml-2 text-sm md:text-xs text-gray-400">
                +{images.length - 6}
              </span>
            )}
          </div>
        </div>
      </footer>

      {/* Custom Cursor Counter */}
      {showCursor && (
        <div
          className="cursor-counter"
          style={{
            left: cursorPosition.x,
            top: cursorPosition.y,
          }}
        >
          {String(selectedIndex + 1).padStart(2, '0')}/{String(images.length).padStart(2, '0')}
        </div>
      )}
    </motion.div>
  )
})

export default ProjectSlider
