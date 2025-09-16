'use client'

import { useState, useEffect } from 'react'

interface KeyboardState {
  isVisible: boolean
  height: number
}

export function useKeyboardAware(): KeyboardState {
  const [keyboardState, setKeyboardState] = useState<KeyboardState>({
    isVisible: false,
    height: 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleViewportChange = () => {
      // Detect keyboard on mobile by comparing viewport height changes
      const currentHeight = window.visualViewport?.height || window.innerHeight
      const fullHeight = window.screen.height
      
      // Consider keyboard visible if viewport is significantly smaller than screen
      const threshold = fullHeight * 0.75
      const isVisible = currentHeight < threshold
      const height = isVisible ? fullHeight - currentHeight : 0

      setKeyboardState({ isVisible, height })
    }

    // Use Visual Viewport API if available (modern mobile browsers)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange)
      
      return () => {
        window.visualViewport?.removeEventListener('resize', handleViewportChange)
      }
    }

    // Fallback for older browsers
    const handleResize = () => {
      setTimeout(handleViewportChange, 100) // Delay to ensure proper height calculation
    }

    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return keyboardState
}