'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import type { SanityImage } from '@/lib/sanity.types'
import { motion, AnimatePresence } from 'framer-motion'

interface ProgressiveImageProps {
  image: SanityImage
  alt: string
  width?: number
  height?: number
  quality?: number
  priority?: boolean
  className?: string
  style?: React.CSSProperties
  sizes?: string
  onLoad?: () => void
  onError?: () => void
}

export default function ProgressiveImage({
  image,
  alt,
  width = 1200,
  height,
  quality = 85,
  priority = false,
  className = '',
  style,
  sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 80vw',
  onLoad,
  onError,
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setHasError(true)
    onError?.()
  }, [onError])

  if (!image?.asset) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">No image</span>
      </div>
    )
  }

  // Generate optimized image URL
  const imageUrl = height
    ? urlFor(image).width(width).height(height).auto('format').quality(quality).url()
    : urlFor(image).width(width).auto('format').quality(quality).url()

  // Low-quality placeholder
  const placeholder = urlFor(image)
    .width(20)
    .quality(20)
    .blur(50)
    .auto('format')
    .url()

  if (hasError) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">Failed to load</span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Low-quality placeholder */}
      {!priority && !isLoaded && (
        <motion.img
          src={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-contain blur-sm"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Main image */}
      <AnimatePresence>
        <motion.div
          className="relative w-full h-full"
          initial={{ opacity: priority ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={imageUrl}
            alt={alt}
            width={width}
            height={height || Math.round(width * 0.67)} // Default 3:2 aspect ratio
            className="object-contain w-full h-full"
            priority={priority}
            sizes={sizes}
            loading={priority ? 'eager' : 'lazy'}
            onLoad={handleLoad}
            onError={handleError}
            style={{
              width: 'auto',
              height: 'auto',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}