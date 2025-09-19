import OptimizedImage from './OptimizedImage'
import type { SanityImage } from '@/lib/sanity.types'

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

export default function ProgressiveImage(props: ProgressiveImageProps) {
  return (
    <OptimizedImage
      source={{ type: 'sanity', image: props.image }}
      {...props}
    />
  )
}