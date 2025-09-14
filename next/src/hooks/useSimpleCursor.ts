'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * Simple project detail cursor hook
 * Shows cursor counter on project pages, hides on buttons/links
 */
export function useSimpleCursor() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [showCursor, setShowCursor] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // Simple desktop detection
  useEffect(() => {
    const checkDesktop = () => {
      const isLargeScreen = window.innerWidth >= 1024
      const hasHover = window.matchMedia('(hover: hover)').matches
      setIsDesktop(isLargeScreen && hasHover)
    }

    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  // Simple mouse tracking
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDesktop) return
    
    setCursorPosition({ x: e.clientX, y: e.clientY })
    
    // Hide cursor when hovering over interactive elements
    const target = e.target as Element
    const isInteractive = target.closest('button, a, [role="button"], [tabindex]')
    
    setShowCursor(!isInteractive)
  }, [isDesktop])

  const handleMouseLeave = useCallback(() => {
    setShowCursor(false)
  }, [])

  // Add global listeners
  useEffect(() => {
    if (!isDesktop) return

    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isDesktop, handleMouseMove, handleMouseLeave])

  return {
    cursorPosition,
    showCursor: isDesktop && showCursor,
  }
}