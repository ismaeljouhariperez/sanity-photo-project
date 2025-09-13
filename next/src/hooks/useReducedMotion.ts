'use client'

import { useEffect, useState } from 'react'

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    // Check if mobile device
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768 || 
                           /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(isMobileDevice)
    }
    
    checkMobile()
    
    // Listen for changes
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    const handleResize = () => {
      checkMobile()
    }

    mediaQuery.addEventListener('change', handleMotionChange)
    window.addEventListener('resize', handleResize)

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Disable parallax on mobile or if user prefers reduced motion
  const shouldDisableParallax = prefersReducedMotion || isMobile

  return {
    prefersReducedMotion,
    isMobile,
    shouldDisableParallax
  }
}