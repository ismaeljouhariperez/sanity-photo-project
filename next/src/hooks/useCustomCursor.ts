import { useState, useCallback, useMemo } from 'react'

/**
 * Custom hook for managing cursor position and visibility
 * Performance optimized with elegant transitions
 * Desktop: Smooth custom cursor with fade transition
 * Mobile/Tablet: No custom cursor (native touch behavior)
 */
export function useCustomCursor() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  // Memoized device detection - only check once
  const isDesktop = useMemo(() => {
    if (typeof window === 'undefined') return false
    
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const hasHover = window.matchMedia('(hover: hover)').matches
    const hasFineCursor = window.matchMedia('(pointer: fine)').matches
    const isLargeScreen = window.matchMedia('(min-width: 1024px)').matches
    
    return !hasTouch && hasHover && hasFineCursor && isLargeScreen
  }, [])

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
    showCursor: isDesktop, // Always render on desktop for performance
    isHovering: isDesktop && isHovering, // For opacity control
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave
  }
}