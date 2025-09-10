'use client'

import Image from 'next/image'
import { useState } from 'react'

interface CloudinaryImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  quality?: number
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png'
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'pad'
  gravity?: 'auto' | 'center' | 'face' | 'faces' | 'body'
  folder?: string
  fallbackSrc?: string
  priority?: boolean
}

/**
 * CloudinaryImage component for loading images from Cloudinary with optimizations
 * Handles automatic format selection, quality optimization, and responsive delivery
 */
export default function CloudinaryImage({
  src,
  alt,
  width,
  height,
  className = '',
  quality = 80,
  format = 'auto',
  crop = 'fill',
  gravity = 'auto',
  folder,
  fallbackSrc,
  priority = false,
}: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Build Cloudinary URL with transformations
  const buildCloudinaryUrl = () => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

    if (!cloudName) {
      console.warn(
        'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not set, falling back to local images'
      )
      return fallbackSrc || `/images/${src}`
    }

    const transformations = [
      `w_${width}`,
      `h_${height}`,
      `c_${crop}`,
      `g_${gravity}`,
      `q_${quality}`,
      `f_${format}`,
    ].join(',')

    // Build path with optional folder
    const basePath = 'sanity-photo-project' // Project folder is always this
    const imagePath = folder
      ? `${basePath}/${folder}/${src}`
      : `${basePath}/${src}`

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${imagePath}`
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)

    // Try fallback image if available
    if (fallbackSrc && !hasError) {
      setHasError(true)
      return
    }

    setHasError(true)
  }

  // Get the image source to use
  const getImageSrc = () => {
    if (hasError && fallbackSrc) {
      return fallbackSrc
    }
    return buildCloudinaryUrl()
  }

  if (hasError && !fallbackSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 text-gray-500 ${className}`}
        style={{ width, height }}
      >
        <span className="text-sm">Image failed to load</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={getImageSrc()}
        alt={alt}
        width={width}
        height={height}
        className={`object-cover transition-opacity delay-200 duration-1000 ${
          isLoading ? 'opacity-50' : 'opacity-100'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        priority={priority}
      />

      {isLoading && (
        <div
          className="-0 absolute animate-pulse bg-gray-100"
          style={{ width, height }}
        />
      )}
    </div>
  )
}
