'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const pathname = usePathname()
  
  // Check if we're on a project detail page (has both category and slug)
  const isProjectDetailPage = pathname && pathname.split('/').length === 3 && pathname.split('/')[2]
  const [contentHeight, setContentHeight] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll()
  
  // Create smooth spring animation - only active on detail pages
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: isProjectDetailPage ? 100 : 0,
    damping: isProjectDetailPage ? 30 : 1000,
    restDelta: 0.001
  })

  // Calculate transform value - only apply on detail pages
  const y = useTransform(
    smoothProgress, 
    [0, 1], 
    [0, isProjectDetailPage ? Math.max(0, contentHeight - windowHeight) : 0]
  )

  const transform = useTransform(y, (value) => isProjectDetailPage ? `translateY(-${value}px)` : 'translateY(0px)')

  useEffect(() => {
    const handleResize = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight)
        setWindowHeight(window.innerHeight)
      }
    }

    // Initial calculation
    handleResize()
    
    // Recalculate on resize
    window.addEventListener('resize', handleResize)
    
    // Recalculate when content changes
    const observer = new ResizeObserver(handleResize)
    if (contentRef.current) {
      observer.observe(contentRef.current)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
    }
  }, [])

  // Update scroll height - only on detail pages
  useEffect(() => {
    if (isProjectDetailPage && contentHeight > windowHeight) {
      document.body.style.height = `${contentHeight}px`
    } else {
      document.body.style.height = 'auto'
    }
    return () => {
      document.body.style.height = 'auto'
    }
  }, [contentHeight, windowHeight, isProjectDetailPage])

  // Reset scroll position when navigating
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // For detail pages, use fixed positioning with smooth scroll
  if (isProjectDetailPage) {
    return (
      <div className="fixed inset-0">
        <motion.div
          ref={contentRef}
          style={{ transform }}
          className="will-change-transform"
        >
          {children}
        </motion.div>
      </div>
    )
  }

  // For category list pages, use normal layout
  return <div>{children}</div>
}