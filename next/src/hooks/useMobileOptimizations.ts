'use client'

import { useState, useEffect } from 'react'

/**
 * Hook for mobile-specific optimizations
 * Detects mobile devices and performance preferences
 */
export function useMobileOptimizations() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [connectionSpeed, setConnectionSpeed] = useState<'slow' | 'fast'>('fast')

  useEffect(() => {
    // Device detection
    const checkDevice = () => {
      const width = window.innerWidth
      const hasTouch = 'ontouchstart' in window
      
      setIsMobile(width < 768 && hasTouch)
      setIsTablet(width >= 768 && width < 1024 && hasTouch)
    }

    // Motion preferences
    const checkMotionPreference = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)
      
      mediaQuery.addEventListener('change', (e) => {
        setPrefersReducedMotion(e.matches)
      })
    }

    // Connection speed detection
    const checkConnection = () => {
      const connection = (navigator as unknown as { connection?: { effectiveType: string } }).connection
      if (connection) {
        const effectiveType = connection.effectiveType
        setConnectionSpeed(effectiveType === '2g' || effectiveType === 'slow-2g' ? 'slow' : 'fast')
      }
    }

    checkDevice()
    checkMotionPreference()
    checkConnection()

    window.addEventListener('resize', checkDevice)
    
    return () => {
      window.removeEventListener('resize', checkDevice)
    }
  }, [])

  // Optimized animation configs
  const getAnimationConfig = (baseConfig: Record<string, unknown>) => {
    if (prefersReducedMotion) {
      return {
        ...baseConfig,
        duration: 0.01, // Nearly instant
        ease: 'linear'
      }
    }

    if (isMobile && connectionSpeed === 'slow') {
      const duration = typeof baseConfig.duration === 'number' ? baseConfig.duration : 0.3
      return {
        ...baseConfig,
        duration: duration * 0.7, // 30% faster
        ease: 'easeOut'
      }
    }

    return baseConfig
  }

  return {
    isMobile,
    isTablet,
    isTouch: isMobile || isTablet,
    prefersReducedMotion,
    connectionSpeed,
    getAnimationConfig,
    // Touch-optimized values
    touchTargetSize: isMobile ? 48 : 44, // Larger on mobile
    gestureThreshold: isMobile ? 50 : 30, // More forgiving on mobile
  }
}