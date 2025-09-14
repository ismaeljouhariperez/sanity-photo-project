import { useState, useCallback, useEffect, useRef } from 'react'

/**
 * High-performance custom cursor hook with immediate detection
 * Next.js 15.5 + React 19 optimized with modern browser APIs
 * Features: Intersection Observer, real-time position detection, non-blocking init
 */
export function useCustomCursor() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [showCursorDelayed, setShowCursorDelayed] = useState(false)
  const [globalMousePosition, setGlobalMousePosition] = useState({ x: 0, y: 0 })
  const rafId = useRef<number>()
  const hoverTimeoutId = useRef<NodeJS.Timeout>()
  const containerRef = useRef<HTMLElement | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  // Global mouse position tracking - high performance
  useEffect(() => {
    if (!isClient) return

    const handleGlobalMouseMove = (e: MouseEvent) => {
      // Throttled global position update
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
      
      rafId.current = requestAnimationFrame(() => {
        setGlobalMousePosition({ x: e.clientX, y: e.clientY })
      })
    }

    document.addEventListener('mousemove', handleGlobalMouseMove, { passive: true })

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [isClient])

  // Optimized client-only pattern - non-blocking
  useEffect(() => {
    // Use requestIdleCallback for non-blocking initialization
    const initCallback = requestIdleCallback(() => {
      setIsClient(true)
    }, { timeout: 200 }) // Fallback after 200ms

    return () => {
      if (typeof cancelIdleCallback !== 'undefined') {
        cancelIdleCallback(initCallback)
      }
    }
  }, [])

  // Robust device detection with media query listeners
  useEffect(() => {
    if (!isClient) return

    const detectDevice = () => {
      try {
        const hasTouch =
          'ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          window.matchMedia('(pointer: coarse)').matches

        const hasHover = window.matchMedia('(hover: hover)').matches
        const hasFineCursor = window.matchMedia('(pointer: fine)').matches
        const isLargeScreen = window.matchMedia('(min-width: 1024px)').matches

        const desktop = !hasTouch && hasHover && hasFineCursor && isLargeScreen

        setIsDesktop(desktop)
        setIsReady(true)

        // Initialize cursor position if desktop - use current mouse position
        if (desktop && globalMousePosition.x > 0) {
          setCursorPosition(globalMousePosition)
        }

        return desktop
      } catch (error) {
        console.warn('Cursor detection failed:', error)
        // Fallback: assume desktop for larger screens
        const fallbackDesktop = window.innerWidth >= 1024
        setIsDesktop(fallbackDesktop)
        setIsReady(true)

        if (fallbackDesktop && globalMousePosition.x > 0) {
          setCursorPosition(globalMousePosition)
        }

        return fallbackDesktop
      }
    }

    // Initial detection
    detectDevice()

    // Listen for changes
    const mediaQueries = [
      window.matchMedia('(hover: hover)'),
      window.matchMedia('(pointer: fine)'),
      window.matchMedia('(min-width: 1024px)'),
    ]

    const handleChange = () => detectDevice()

    mediaQueries.forEach((mq) => {
      mq.addEventListener('change', handleChange)
    })

    return () => {
      mediaQueries.forEach((mq) => {
        mq.removeEventListener('change', handleChange)
      })
    }
  }, [isClient, globalMousePosition])

  // High-performance boundary detection with ResizeObserver
  const checkBoundaryPosition = useCallback(() => {
    if (!containerRef.current || !isReady || !isDesktop) return

    const rect = containerRef.current.getBoundingClientRect()
    const isInBounds = 
      globalMousePosition.x >= rect.left && 
      globalMousePosition.x <= rect.right &&
      globalMousePosition.y >= rect.top && 
      globalMousePosition.y <= rect.bottom

    if (isInBounds !== isHovering) {
      setIsHovering(isInBounds)
      
      if (isInBounds) {
        setCursorPosition(globalMousePosition)
        
        // Clear any existing timeout
        if (hoverTimeoutId.current) {
          clearTimeout(hoverTimeoutId.current)
        }

        // Show cursor after smooth delay (300ms for fluid feeling)
        hoverTimeoutId.current = setTimeout(() => {
          setShowCursorDelayed(true)
        }, 300)
      } else {
        setShowCursorDelayed(false)
        
        // Clear timeout on leave
        if (hoverTimeoutId.current) {
          clearTimeout(hoverTimeoutId.current)
        }
      }
    }
  }, [globalMousePosition, isReady, isDesktop, isHovering])

  // Real-time boundary checking when mouse moves
  useEffect(() => {
    if (isReady && isDesktop && globalMousePosition.x > 0) {
      checkBoundaryPosition()
    }
  }, [globalMousePosition, checkBoundaryPosition, isReady, isDesktop])

  // Performance-optimized mouse handlers with RAF
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isReady || !isDesktop) return

      // Local cursor position updates for responsiveness
      setCursorPosition({ x: e.clientX, y: e.clientY })
    },
    [isReady, isDesktop]
  )

  // Simplified handlers - boundary detection handles the logic
  const handleMouseEnter = useCallback(() => {
    // Boundary detection system handles hover state
  }, [])

  const handleMouseLeave = useCallback(() => {
    // Boundary detection system handles hover state
  }, [])

  // Container registration with ResizeObserver for dynamic size changes
  const registerContainer = useCallback((element: HTMLElement | null) => {
    containerRef.current = element
    
    // Cleanup previous observer
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect()
    }
    
    if (element && isReady && isDesktop) {
      // Create ResizeObserver for container size changes
      resizeObserverRef.current = new ResizeObserver(() => {
        // Re-check boundary when container resizes
        requestAnimationFrame(() => {
          checkBoundaryPosition()
        })
      })
      
      resizeObserverRef.current.observe(element)
      
      // Immediate boundary check on registration
      requestAnimationFrame(() => {
        checkBoundaryPosition()
      })
    }
  }, [isReady, isDesktop, checkBoundaryPosition])

  // Cleanup RAF, timeouts, and observers on unmount
  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
      if (hoverTimeoutId.current) {
        clearTimeout(hoverTimeoutId.current)
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [])

  return {
    cursorPosition,
    showCursor: isClient && isReady && isDesktop && showCursorDelayed,
    isHovering: isClient && isReady && isDesktop && isHovering,
    isReady, // For debugging/loading states
    registerContainer, // Modern container registration with boundary detection
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  }
}
