'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import type { SanityImage } from '@/lib/sanity.types'
import { motion, AnimatePresence } from 'framer-motion'
import { getImageDimensions } from '@sanity/asset-utils'

interface RobustImageProps {
  image: SanityImage
  alt: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  className?: string
  sizes?: string
  onLoad?: () => void
  onError?: () => void
  maxRetries?: number
}

export default function RobustImage({
  image,
  alt,
  fill = false,
  width,
  height,
  priority = false,
  className = '',
  sizes,
  onLoad,
  onError,
  maxRetries = 3,
}: RobustImageProps) {
  const [retryCount, setRetryCount] = useState(0)
  const [, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Get image dimensions for proper aspect ratio (2025 best practice)
  const dimensions = image?.asset ? getImageDimensions(image.asset) : null
  
  // Modern Sanity CDN optimization with auto-format and quality progression
  const generateImageUrl = useCallback((quality: number = 90, maxWidth?: number) => {
    const builder = urlFor(image).auto('format').quality(quality)
    if (maxWidth) builder.width(maxWidth)
    if (dimensions) builder.width(dimensions.width).height(dimensions.height).fit('max')
    return builder.url()
  }, [image, dimensions])

  // Progressive quality URLs for timeout handling
  const primaryUrl = generateImageUrl(90)
  const fallbackUrl = generateImageUrl(75) 
  const emergencyUrl = generateImageUrl(50, 1200)
  
  // Determine which URL to use with progressive quality reduction
  const imageUrl = retryCount === 0 ? primaryUrl : 
                   retryCount === 1 ? fallbackUrl : 
                   emergencyUrl
  
  // Optimized blur placeholder (Next.js 15.5 compatible)
  const blurDataURL = urlFor(image).width(24).height(24).quality(20).blur(10).url()

  // Reset states when image changes
  useEffect(() => {
    setRetryCount(0)
    setIsLoading(true)
    setHasError(false)
    setShowPlaceholder(true)
    
    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // Set a timeout for the image loading (progressive based on retry count)
    const timeoutDuration = priority ? 5000 : 10000 + (retryCount * 5000) // 5s priority, 10s+ for others
    timeoutRef.current = setTimeout(() => {
      if (showPlaceholder) {
        console.warn(`Image load timeout after ${timeoutDuration}ms:`, imageUrl)
        handleError()
      }
    }, timeoutDuration)
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [image, retryCount, priority, showPlaceholder, imageUrl, handleError])

  const handleLoad = useCallback(() => {
    // Clear timeout on successful load
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    setIsLoading(false)
    setShowPlaceholder(false)
    setHasError(false)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    console.warn(`Image load failed (attempt ${retryCount + 1}/${maxRetries + 1}):`, imageUrl)
    
    if (retryCount < maxRetries) {
      // Progressive retry with exponential backoff and quality reduction
      const delay = Math.min(1000 * Math.pow(2, retryCount), 8000) // Max 8 second delay
      setTimeout(() => {
        setRetryCount(prev => prev + 1)
        setIsLoading(true)
        setShowPlaceholder(true)
      }, delay)
    } else {
      setHasError(true)
      setIsLoading(false)
      setShowPlaceholder(false)
      onError?.()
    }
  }, [retryCount, maxRetries, imageUrl, onError])

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

  if (hasError) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-sm p-4 text-center">
          <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Failed to load image
          <br />
          <button 
            onClick={() => {
              setRetryCount(0)
              setHasError(false)
              setIsLoading(true)
            }}
            className="text-xs text-blue-500 hover:text-blue-700 mt-1 underline"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${fill ? 'w-full h-full' : ''} ${className}`}>
      {/* Elegant minimalistic loading placeholder */}
      <AnimatePresence>
        {showPlaceholder && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 z-10 bg-gray-50"
          >
            {/* Sophisticated skeleton with subtle gradient */}
            <div className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 animate-pulse">
              {/* Subtle loading indicator */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex space-x-1">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.3 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      duration: 0.8,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.3 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      duration: 0.8,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                      delay: 0.2
                    }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.3 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      duration: 0.8,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                      delay: 0.4
                    }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main image with 2025 best practices */}
      <Image
        key={`${image.asset._ref}-${retryCount}`}
        src={imageUrl}
        alt={alt}
        fill={fill}
        width={fill ? undefined : (width || dimensions?.width)}
        height={fill ? undefined : (height || dimensions?.height)}
        className={fill ? 'object-contain' : 'object-contain w-full h-full'}
        priority={priority}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1600px"}
        loading={priority ? 'eager' : 'lazy'}
        placeholder="blur"
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        unoptimized={retryCount > 0}
        // Custom loader for CDN optimization (2025 best practice)
        loader={retryCount > 0 ? undefined : ({ width: loaderWidth, quality = 90 }) => 
          urlFor(image)
            .auto('format')
            .width(loaderWidth)
            .quality(quality)
            .fit('max')
            .url()
        }
      />
    </div>
  )
}