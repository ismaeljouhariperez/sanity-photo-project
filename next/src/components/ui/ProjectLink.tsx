'use client'
import Link from 'next/link'
import { useState } from 'react'

interface ProjectLinkProps {
  href: string // Will be typed by Next.js typed routes
  children: React.ReactNode
  className?: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onClick?: () => void
  enablePrefetch?: boolean // Control prefetching
}

/**
 * Project link optimized for View Transitions API + Next.js 15.5
 * Intelligent prefetching strategy for smooth view transitions
 */
export default function ProjectLink({
  href,
  children,
  className,
  onMouseEnter,
  onMouseLeave,
  onClick,
  enablePrefetch = true, // Enable by default for view transitions
}: ProjectLinkProps) {
  const [shouldPrefetch, setShouldPrefetch] = useState(false)

  const handleMouseEnter = () => {
    if (enablePrefetch) {
      // Immediate prefetch for smooth view transitions
      setShouldPrefetch(true)
    }
    onMouseEnter?.()
  }

  const handleMouseLeave = () => {
    onMouseLeave?.()
  }

  return (
    <Link
      href={href as `/black-and-white` | `/early-color` | `/${string}/${string}`} // Type assertion for typed routes compatibility
      prefetch={enablePrefetch && shouldPrefetch ? true : false}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
    >
      {children}
    </Link>
  )
}