import { useState, useCallback, useEffect } from 'react'

/**
 * Custom hook for managing cursor position and visibility
 * Desktop: Always show custom cursor
 * Mobile/Tablet: No custom cursor (use native touch)
 * React 19 best practices with device detection
 */
export function useCustomCursor() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isDesktop, setIsDesktop] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // Detect desktop vs mobile/tablet
  useEffect(() => {
    const checkDevice = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isLargeScreen = window.matchMedia('(min-width: 1024px)').matches
      setIsDesktop(!hasTouch && isLargeScreen)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // Update cursor position on mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDesktop) {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }
  }, [isDesktop])

  const handleMouseEnter = useCallback(() => {
    if (isDesktop) {
      setIsHovering(true)
    }
  }, [isDesktop])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
  }, [])

  return {
    cursorPosition,
    showCursor: isDesktop && isHovering, // Only show when on desktop AND hovering
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave
  }
}