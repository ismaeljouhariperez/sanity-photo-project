'use client'

import { memo } from 'react'

interface CarouselNavigationProps {
  selectedIndex: number
  totalSlides: number
  onNavigate: (index: number) => void
  maxDots?: number
  className?: string
}

const CarouselNavigation = memo(function CarouselNavigation({
  selectedIndex,
  totalSlides,
  onNavigate,
  maxDots = 7,
  className = ''
}: CarouselNavigationProps) {
  const showDots = Math.min(totalSlides, maxDots)
  const remainingSlides = totalSlides - maxDots

  return (
    <div className={`flex items-center gap-2 rounded-full bg-black/20 px-3 py-1.5 backdrop-blur-sm ${className}`}>
      {/* Navigation dots */}
      {Array.from({ length: showDots }).map((_, index) => (
        <button
          key={index}
          onClick={() => onNavigate(index)}
          className="touch-manipulation p-1"
          aria-label={`Go to slide ${index + 1}`}
        >
          <div
            className={`h-1.5 w-1.5 rounded-full transition-all ${
              index === selectedIndex ? 'scale-125 bg-white' : 'bg-white/50'
            }`}
          />
        </button>
      ))}
      
      {/* Show remaining slides indicator */}
      {remainingSlides > 0 && (
        <span className="ml-1 text-xs text-white/70" aria-label={`${remainingSlides} more slides`}>
          +{remainingSlides}
        </span>
      )}
    </div>
  )
})

export default CarouselNavigation