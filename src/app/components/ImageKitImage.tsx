import Image from 'next/image'

interface ImageKitImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
}

export default function ImageKitImage({ src, alt, width, height, className, fill }: ImageKitImageProps) {
  return (
    <Image
      src={`https://ik.imagekit.io/ismaelahab/${src}`}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
    />
  )
} 