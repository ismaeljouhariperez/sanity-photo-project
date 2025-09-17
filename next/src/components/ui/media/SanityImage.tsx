'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import type { SanityImage as SanityImageType } from '@/lib/sanity.types'
import { getImageDimensions } from '@sanity/asset-utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useImageLoader } from '@/hooks/useImageLoader'

interface SanityImageProps {
  image: SanityImageType
  alt: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  className?: string
  sizes?: string
  quality?: number
  onLoad?: () => void
  onError?: () => void
  maxRetries?: number
  timeoutMs?: number
  emblaOptimized?: boolean // Special optimizations for Embla carousel
  galleryMode?: boolean // Minimal placeholder for gallery grids
}

// Reusable loader component with modern animations
const ImageLoader = ({ className, galleryMode = false }: { className?: string, galleryMode?: boolean }) => (
  <motion.div
    initial={{ opacity: 0.8 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={`absolute inset-0 z-10 ${galleryMode ? 'bg-gray-100/90' : 'bg-gray-50/80'} ${className || ''}`}
  >
    <div className={`w-full h-full ${galleryMode ? 'bg-gray-200/50' : 'bg-gradient-to-br from-gray-100/60 via-gray-50/60 to-gray-100/60'} animate-pulse`}>
      {!galleryMode && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-1">
            {[0, 0.2, 0.4].map((delay, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0.3 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay
                }}
                className="w-2 h-2 bg-gray-400 rounded-full"
              />
            ))}
          </div>
        </div>
      )}
      {galleryMode && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  </motion.div>
)

// Error state component
const ImageError = ({ onRetry, className }: { onRetry: () => void, className?: string }) => (
  <div className={`bg-gray-100 flex items-center justify-center ${className || ''}`}>
    <div className="text-gray-400 text-sm p-4 text-center">
      <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      Failed to load image
      <br />
      <button 
        onClick={onRetry}
        className="text-xs text-blue-500 hover:text-blue-700 mt-1 underline"
      >
        Retry
      </button>
    </div>
  </div>
)

export default function SanityImage({
  image,
  alt,
  fill = false,
  width,
  height,
  priority = false,
  className = '',
  sizes,
  quality = 85,
  onLoad,
  onError,
  maxRetries = 2,
  timeoutMs,
  emblaOptimized = false,
  galleryMode = false,
}: SanityImageProps) {
  
  // Image loading state management
  const loader = useImageLoader({
    priority,
    maxRetries,
    timeoutMs: timeoutMs || (emblaOptimized ? 1000 : undefined),
    onLoad,
    onError
  })

  // Simplified image data with single URL generation (2025 best practice)
  const imageData = useMemo(() => {
    if (!image?.asset) return null
    
    const dimensions = getImageDimensions(image.asset)
    
    // Single URL with optimal settings - no complex fallback logic
    const imageUrl = urlFor(image)
      .auto('format') // Automatic WebP/AVIF 
      .quality(quality)
      .fit('max')
      .url()
    
    const blurUrl = urlFor(image)
      .width(24)
      .height(24)
      .quality(20)
      .blur(10)
      .url()
    
    console.log('Generated Sanity image URL:', imageUrl)
    
    return {
      dimensions,
      url: imageUrl,
      blurUrl
    }
  }, [image, quality])

  // Simple image URL - no complex retry URL switching
  const imageUrl = imageData?.url || ''

  // Custom loader for Sanity CDN optimization (2025 best practice)
  const customLoader = ({ width: loaderWidth, quality: loaderQuality = quality }: { width: number, quality?: number }) => {
    const url = urlFor(image)
      .auto('format')
      .width(loaderWidth)
      .quality(loaderQuality)
      .fit('max')
      .url()
    
    console.log('Custom loader URL:', url, { width: loaderWidth, quality: loaderQuality })
    return url
  }

  // Handle missing image
  if (!image?.asset) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-sm p-4">
          <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          No image
        </div>
      </div>
    )
  }

  // Handle error state
  if (loader.hasError) {
    return <ImageError onRetry={loader.resetLoader} className={className} />
  }

  return (
    <div className={`relative ${fill ? 'w-full h-full' : ''} ${className}`}>
      {/* Modern loading placeholder with proper visibility */}
      <AnimatePresence>
        {loader.showPlaceholder && <ImageLoader galleryMode={galleryMode} />}
      </AnimatePresence>

      {/* Optimized Next.js Image with 2025 best practices */}
      <Image
        key={`${image.asset._ref}-${loader.retryCount}`}
        src={imageUrl}
        alt={alt}
        fill={fill}
        width={fill ? undefined : (width || imageData?.dimensions?.width)}
        height={fill ? undefined : (height || imageData?.dimensions?.height)}
        className={fill ? 'object-contain' : 'object-contain w-full h-full'}
        priority={priority}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1600px"}
        loading={priority ? 'eager' : 'lazy'}
        placeholder="blur"
        blurDataURL={imageData?.blurUrl}
        onLoad={loader.handleLoad}
        onError={loader.handleError}
        loader={customLoader}
      />
    </div>
  )
}