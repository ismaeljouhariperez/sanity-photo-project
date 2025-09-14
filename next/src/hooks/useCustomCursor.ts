import { useState, useCallback, useMemo, useEffect } from 'react'

/**
 * Custom hook for managing cursor position and visibility
 * Performance optimized with elegant transitions
 * Desktop: Smooth custom cursor with fade transition
 * Mobile/Tablet: No custom cursor (native touch behavior)
 * SSR/Hydration safe
 */
export function useCustomCursor() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Official Next.js pattern for client-only content
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Memoized device detection - only after client-side hydration
  const isDesktop = useMemo(() => {
    if (!isClient) return false
    
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const hasHover = window.matchMedia('(hover: hover)').matches
    const hasFineCursor = window.matchMedia('(pointer: fine)').matches
    const isLargeScreen = window.matchMedia('(min-width: 1024px)').matches
    
    return !hasTouch && hasHover && hasFineCursor && isLargeScreen
  }, [isClient])

  // Optimized mouse move handler - only update when needed
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDesktop) return
    
    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    })
  }, [isDesktop])

  const handleMouseEnter = useCallback(() => {
    if (isDesktop) {
      setIsHovering(true)
    }
  }, [isDesktop])

  const handleMouseLeave = useCallback(() => {
    if (isDesktop) {
      setIsHovering(false)
    }
  }, [isDesktop])

  return {
    cursorPosition,
    showCursor: isClient && isDesktop, // Official Next.js client-only pattern
    isHovering: isClient && isDesktop && isHovering, // For opacity control
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave
  }
}