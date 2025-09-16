'use client'

import { useEffect, memo } from 'react'
import type { Project } from '@/lib/sanity.types'
import { easeInOut, motion } from 'framer-motion'
import RobustImage from './RobustImage'
import { useSimpleCursor } from '@/hooks/useSimpleCursor'
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations'
import { useCurrentProjectStore } from '@/store/currentProjectStore'
import { useProjectCarousel } from '@/hooks/useProjectCarousel'
import TextSlide from './TextSlide'
import CarouselSlide from './CarouselSlide'
import CarouselNavigation from './CarouselNavigation'
import styles from './ProjectSlider.module.css'

interface ProjectSliderProps {
  project: Project
}

const ProjectSlider = memo(function ProjectSlider({
  project,
}: ProjectSliderProps) {
  // Set current project in store for other components
  const setProject = useCurrentProjectStore((state) => state.setProject)

  const images = project.images || []
  const totalSlides = images.length + 1 // Images + text slide

  // Custom carousel hook with all Embla logic
  const { emblaRef, selectedIndex, scrollPrev, scrollNext, scrollTo } =
    useProjectCarousel()

  // UI hooks
  const { cursorPosition, showCursor } = useSimpleCursor()
  const { getAnimationConfig } = useMobileOptimizations()

  // Set project in store when component mounts
  useEffect(() => {
    setProject(project)
    return () => setProject(null)
  }, [project, setProject])

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
      className="flex h-full w-full flex-col"
    >
      {/* Touch-friendly carousel container */}
      <div className="custom-cursor h-full touch-pan-x lg:touch-auto">
        <div className="embla h-full" ref={emblaRef}>
          <div className={styles.emblaContainer}>
            {/* Image slides */}
            {images.map((image, index) => (
              <CarouselSlide
                key={image._key || index}
                isActive={index === selectedIndex}
              >
                <div className="relative h-full w-full p-4 md:p-8 min-h-[50vh]">
                  <RobustImage
                    image={image.image}
                    alt={`Image ${index + 1}`}
                    fill
                    priority={index <= 1}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1600px"
                    maxRetries={3}
                  />
                </div>
              </CarouselSlide>
            ))}

            {/* Text slide - final slide */}
            <CarouselSlide isActive={selectedIndex === images.length}>
              <TextSlide project={project} />
            </CarouselSlide>
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

      {/* Mobile navigation */}
      <footer className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 lg:hidden">
        <CarouselNavigation
          selectedIndex={selectedIndex}
          totalSlides={totalSlides}
          onNavigate={scrollTo}
          maxDots={7}
        />
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
