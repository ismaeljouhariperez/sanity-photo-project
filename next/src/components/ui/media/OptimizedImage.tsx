'use client'

import { useMemo, memo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { urlFor } from '@/lib/sanity'
import type { SanityImage } from '@/lib/sanity.types'
import { useImageLoader } from '@/hooks/useImageLoader'

// Unified image source types
type ImageSource = 
  | { type: 'sanity'; image: SanityImage }
  | { type: 'cloudinary'; src: string; folder?: string; fallbackSrc?: string }
  | { type: 'static'; src: string }

interface OptimizedImageProps {
  source: ImageSource
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
  priority?: boolean
  quality?: number
  sizes?: string
  
  // Cloudinary specific
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'pad'
  gravity?: 'auto' | 'center' | 'face' | 'faces' | 'body'
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png'
  
  // SanityImage specific
  maxRetries?: number
  timeoutMs?: number
  emblaOptimized?: boolean
  galleryMode?: boolean
  
  // Callbacks
  onLoad?: () => void
  onError?: () => void
}

// Cloudinary URL builder
const buildCloudinaryUrl = (
  src: string,
  width: number,
  height: number,
  quality: number,
  crop: string,
  gravity: string,
  format: string,
  folder?: string
) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  
  if (!cloudName) {
    console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not set, falling back to local images')
    return `/images/${src}`
  }

  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `c_${crop}`,
    `g_${gravity}`,
    `q_${quality}`,
    `f_${format}`,
  ].join(',')

  // Build path with project folder structure
  const basePath = 'sanity-photo-project' // Project folder is always this
  const imagePath = folder
    ? `${basePath}/${folder}/${src}`
    : `${basePath}/${src}`

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${imagePath}`
}

// Loading placeholder component
const ImageLoader = memo(function ImageLoader({
  className,
  galleryMode = false,
}: {
  className?: string
  galleryMode?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0.8 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`absolute inset-0 z-10 ${galleryMode ? 'bg-gray-100/90' : 'bg-gray-50/80'} ${className || ''}`}
    >
      <div
        className={`h-full w-full ${galleryMode ? 'bg-gray-200/50' : 'bg-gradient-to-br from-gray-100/60 via-gray-50/60 to-gray-100/60'} animate-pulse`}
      >
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
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                    delay,
                  }}
                  className="h-2 w-2 rounded-full bg-gray-400"
                />
              ))}
            </div>
          </div>
        )}
        {galleryMode && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 animate-pulse rounded-full bg-gray-300" />
          </div>
        )}
      </div>
    </motion.div>
  )
})

// Error state component
const ImageError = memo(function ImageError({
  onRetry,
  className,
}: {
  onRetry?: () => void
  className?: string
}) {
  return (
    <div className={`bg-cream flex h-full w-full items-center justify-center ${className || ''}`}>
      <div className="p-4 text-center text-sm text-gray-500">
        <svg
          className="mx-auto mb-2 h-8 w-8"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        Image non chargée
        {onRetry && (
          <>
            <br />
            <button
              onClick={onRetry}
              className="mt-1 text-xs text-blue-500 underline hover:text-blue-700"
            >
              Réessayer
            </button>
          </>
        )}
      </div>
    </div>
  )
})

const OptimizedImage = memo(function OptimizedImage({
  source,
  alt,
  fill = false,
  width,
  height,
  className = '',
  style,
  priority = false,
  quality = 85,
  sizes,
  crop = 'fill',
  gravity = 'auto',
  format = 'auto',
  maxRetries = 2,
  timeoutMs,
  emblaOptimized = false,
  galleryMode = false,
  onLoad,
  onError,
}: OptimizedImageProps) {
  // Use centralized image loading logic
  const loader = useImageLoader({
    priority,
    maxRetries,
    timeoutMs: timeoutMs || (emblaOptimized ? 1000 : undefined),
    onLoad,
    onError,
  })

  // Generate image URL and metadata based on source type
  const imageData = useMemo(() => {
    switch (source.type) {
      case 'sanity': {
        if (!source.image?.asset) return null
        
        // For gallery mode, use specified dimensions
        const sanityBuilder = urlFor(source.image)
          .auto('format')
          .quality(quality)
          .fit('max')
        
        // Add dimensions if provided (important for gallery images)
        if (width && height) {
          sanityBuilder.width(width).height(height)
        }
        
        const imageUrl = sanityBuilder.url()

        const blurUrl = urlFor(source.image)
          .width(24)
          .height(24)
          .quality(20)
          .blur(10)
          .url()

        return {
          url: imageUrl,
          blurUrl,
          dimensions: source.image.metadata?.dimensions,
        }
      }
      
      case 'cloudinary': {
        const imageWidth = width || 1200
        const imageHeight = height || 800
        
        const imageUrl = buildCloudinaryUrl(
          source.src,
          imageWidth,
          imageHeight,
          quality,
          crop,
          gravity,
          format,
          source.folder
        )

        return {
          url: imageUrl,
          blurUrl: undefined, // Cloudinary can generate on-the-fly
          dimensions: { width: imageWidth, height: imageHeight },
          fallbackUrl: source.fallbackSrc,
        }
      }
      
      case 'static': {
        return {
          url: source.src,
          blurUrl: undefined,
          dimensions: width && height ? { width, height } : undefined,
        }
      }
      
      default:
        return null
    }
  }, [source, quality, width, height, crop, gravity, format])

  // Handle missing image
  if (!imageData?.url) {
    return (
      <div className="bg-cream flex h-full w-full items-center justify-center">
        <div className="text-gray-500">Image non chargée</div>
      </div>
    )
  }

  // Handle error state
  if (loader.hasError) {
    // Try fallback for Cloudinary
    if (source.type === 'cloudinary' && imageData.fallbackUrl) {
      return (
        <OptimizedImage
          source={{ type: 'static', src: imageData.fallbackUrl }}
          alt={alt}
          fill={fill}
          width={width}
          height={height}
          className={className}
          style={style}
          priority={priority}
          quality={quality}
          sizes={sizes}
          onLoad={onLoad}
          onError={onError}
        />
      )
    }
    
    return <ImageError onRetry={loader.resetLoader} className={className} />
  }

  return (
    <div className={`relative ${fill ? 'h-full w-full' : ''} ${className}`} style={style}>
      {/* Loading placeholder */}
      <AnimatePresence>
        {loader.showPlaceholder && <ImageLoader galleryMode={galleryMode} />}
      </AnimatePresence>

      {/* Optimized Next.js Image */}
      <Image
        key={`${imageData.url}-${loader.retryCount}`}
        src={imageData.url}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width || imageData.dimensions?.width}
        height={fill ? undefined : height || imageData.dimensions?.height}
        className={fill ? 'object-contain' : 'h-full w-full object-contain'}
        priority={priority}
        sizes={
          sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1920px'
        }
        loading={priority ? 'eager' : 'lazy'}
        placeholder={imageData.blurUrl ? 'blur' : 'empty'}
        blurDataURL={imageData.blurUrl}
        onLoad={loader.handleLoad}
        onError={loader.handleError}
        style={fill ? undefined : style}
      />
    </div>
  )
})

export default OptimizedImage