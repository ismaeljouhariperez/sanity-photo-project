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
}: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Build Cloudinary URL with transformations
  const buildCloudinaryUrl = () => {
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

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${src}`
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (hasError) {
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
        src={buildCloudinaryUrl()}
        alt={alt}
        width={width}
        height={height}
        className={`object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        priority={false}
      />
      
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-100 animate-pulse"
          style={{ width, height }}
        />
      )}
    </div>
  )
}