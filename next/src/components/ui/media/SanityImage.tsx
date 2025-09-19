import OptimizedImage from './OptimizedImage'
import type { SanityImage as SanityImageType } from '@/lib/sanity.types'

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
  emblaOptimized?: boolean
  galleryMode?: boolean
}

export default function SanityImage(props: SanityImageProps) {
  return (
    <OptimizedImage
      source={{ type: 'sanity', image: props.image }}
      {...props}
    />
  )
}
