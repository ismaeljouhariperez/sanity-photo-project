'use client'

import { useState, useEffect } from 'react'
import { urlFor } from '@/lib/sanity'
import type { SanityImage } from '@/lib/sanity.types'

interface ImageOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'auto' | 'webp' | 'jpg' | 'png'
  priority?: boolean
}

interface OptimizedImageData {
  src: string
  srcSet: string
  sizes: string
  placeholder?: string
}

export function useSanityImage(
  image: SanityImage,
  options: ImageOptions = {}
): OptimizedImageData {
  const {
    width = 1200,
    height,
    quality = 85,
    format = 'auto',
    priority = false
  } = options

  const [imageData, setImageData] = useState<OptimizedImageData>({
    src: '',
    srcSet: '',
    sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 80vw',
  })

  useEffect(() => {
    if (!image?.asset) return

    // Generate optimized URLs for different screen sizes
    const baseUrl = format === 'auto' 
      ? urlFor(image).auto('format').quality(quality)
      : urlFor(image).format(format).quality(quality)
    
    // Generate srcSet for responsive images
    const breakpoints = [320, 640, 768, 1024, 1280, 1600]
    const srcSetEntries = breakpoints.map(bp => {
      const url = height 
        ? baseUrl.width(bp).height(Math.round((bp * height) / width)).url()
        : baseUrl.width(bp).url()
      return `${url} ${bp}w`
    })

    // Main source (largest size)
    const mainSrc = height 
      ? baseUrl.width(width).height(height).url()
      : baseUrl.width(width).url()

    // Generate low-quality placeholder
    const placeholder = format === 'auto'
      ? urlFor(image).width(20).quality(20).blur(50).auto('format').url()
      : urlFor(image).width(20).quality(20).blur(50).format(format).url()

    setImageData({
      src: mainSrc,
      srcSet: srcSetEntries.join(', '),
      sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 80vw',
      placeholder: priority ? undefined : placeholder,
    })
  }, [image, width, height, quality, format, priority])

  return imageData
}