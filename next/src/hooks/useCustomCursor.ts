import { useState, useCallback } from 'react'

/**
 * Custom hook for managing cursor position and visibility
 * Optimized for performance with React 19 best practices
 */
export function useCustomCursor() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [showCursor, setShowCursor] = useState(false)

  // Throttle mouse move for better performance
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    })
  }, [])

  const handleMouseEnter = useCallback(() => {
    setShowCursor(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setShowCursor(false)
  }, [])

  return {
    cursorPosition,
    showCursor,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave
  }
}