import { memo } from 'react'
import OptimizedImage from './OptimizedImage'

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
  onLoad?: () => void
  onError?: () => void
}

/**
 * CloudinaryImage component for loading images from Cloudinary with optimizations
 * Now uses the unified OptimizedImage component
 */
const CloudinaryImage = memo(function CloudinaryImage({
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
  onLoad,
  onError,
}: CloudinaryImageProps) {
  return (
    <OptimizedImage
      source={{ 
        type: 'cloudinary', 
        src, 
        folder, 
        fallbackSrc 
      }}
      alt={alt}
      width={width}
      height={height}
      className={className}
      quality={quality}
      format={format}
      crop={crop}
      gravity={gravity}
      priority={priority}
      onLoad={onLoad}
      onError={onError}
    />
  )
})

export default CloudinaryImage