'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { useImageNavigationStore } from '@/store/currentProjectStore'

interface UseProjectCarouselOptions {
  onSlideChange?: (index: number) => void
}

export function useProjectCarousel({ onSlideChange }: UseProjectCarouselOptions = {}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex: 0,
    dragFree: false,
    watchDrag: true,
    duration: 0, // CSS handles transitions
    dragThreshold: 15,
    skipSnaps: false,
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const { targetImageIndex, clearTarget } = useImageNavigationStore()

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    
    const newIndex = emblaApi.selectedScrollSnap()
    setSelectedIndex(newIndex)
    onSlideChange?.(newIndex)
  }, [emblaApi, onSlideChange])

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev()
    }
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext()
    }
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(index)
      }
    },
    [emblaApi]
  )

  // Setup Embla event listeners
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
      emblaApi.scrollTo(targetImageIndex)
      clearTarget()
    }
  }, [emblaApi, targetImageIndex, clearTarget])

  return {
    emblaRef,
    selectedIndex,
    scrollPrev,
    scrollNext,
    scrollTo,
    canScrollPrev: emblaApi?.canScrollPrev() ?? false,
    canScrollNext: emblaApi?.canScrollNext() ?? false,
  }
}