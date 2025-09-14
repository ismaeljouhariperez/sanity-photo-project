'use client'

import { useEffect, useState, useCallback } from 'react'
import { urlFor } from '@/lib/sanity'
import type { Project } from '@/lib/sanity.types'
import useEmblaCarousel from 'embla-carousel-react'
import { easeInOut, motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface ProjectSliderProps {
  project: Project
}

export default function ProjectSlider({ project }: ProjectSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex: 0,
    containScroll: 'trimSnaps',
    duration: 0, // Disable Embla's slide animation
    dragFree: false,
    watchDrag: false, // Disable drag to prevent conflicts with our fade
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [showCursor, setShowCursor] = useState(false)
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

  // Mouse tracking for custom cursor
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setCursorPosition({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseEnter = useCallback(() => {
    setShowCursor(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setShowCursor(false)
  }, [])

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
        className="h-full custom-cursor"
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

      {/* Footer Controls */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 flex justify-center p-6">
        <div className="flex items-center gap-6 rounded-full px-6 py-3 backdrop-blur-sm">
          {/* Image Counter */}
          <div className="flex items-center gap-2 font-mono text-sm text-gray-700">
            <span>{String(selectedIndex + 1).padStart(2, '0')}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-400">
              {String(images.length).padStart(2, '0')}
            </span>
          </div>

          {/* Dots Navigation */}
          <div className="flex items-center gap-2">
            {images.slice(0, 8).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === selectedIndex
                    ? 'bg-black'
                    : 'bg-black/30 hover:bg-black/50'
                }`}
              />
            ))}
            {images.length > 8 && (
              <span className="ml-2 text-xs text-gray-400">
                +{images.length - 8}
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
}
