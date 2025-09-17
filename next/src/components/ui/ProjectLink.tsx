'use client'
import Link from 'next/link'
import { useState } from 'react'

interface ProjectLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onClick?: () => void
}

/**
 * Project link with hover prefetching for Next.js 15.5
 * Optimizes navigation performance by prefetching routes only on hover
 */
export default function ProjectLink({
  href,
  children,
  className,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: ProjectLinkProps) {
  const [shouldPrefetch, setShouldPrefetch] = useState(false)

  const handleMouseEnter = () => {
    setShouldPrefetch(true)
    onMouseEnter?.()
  }

  const handleMouseLeave = () => {
    onMouseLeave?.()
  }

  return (
    <Link
      href={href}
      prefetch={shouldPrefetch ? null : false}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
    >
      {children}
    </Link>
  )
}