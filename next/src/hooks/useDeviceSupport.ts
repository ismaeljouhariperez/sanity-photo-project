'use client'

import { useState, useEffect } from 'react'

interface DeviceSupport {
  isIOS: boolean
  isAndroid: boolean
  orientation: 'portrait' | 'landscape'
  screenHeight: number
  screenWidth: number
  supportsNotch: boolean
}

export function useDeviceSupport(): DeviceSupport {
  const [deviceInfo, setDeviceInfo] = useState<DeviceSupport>({
    isIOS: false,
    isAndroid: false,
    orientation: 'portrait',
    screenHeight: 0,
    screenWidth: 0,
    supportsNotch: false,
  })

  useEffect(() => {
    const updateDeviceInfo = () => {
      const userAgent = navigator.userAgent
      const isIOS = /iPad|iPhone|iPod/.test(userAgent)
      const isAndroid = /Android/.test(userAgent)
      
      // Detect orientation
      const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      
      // Check for notch support (iOS devices with safe area)
      const supportsNotch = isIOS && 'CSS' in window && CSS.supports('padding-top: env(safe-area-inset-top)')

      setDeviceInfo({
        isIOS,
        isAndroid,
        orientation,
        screenHeight: window.innerHeight,
        screenWidth: window.innerWidth,
        supportsNotch,
      })
    }

    // Initial setup
    updateDeviceInfo()

    // Listen for orientation changes
    const handleOrientationChange = () => {
      // Use setTimeout to ensure viewport dimensions are updated
      setTimeout(updateDeviceInfo, 100)
    }

    // Listen for resize events (covers orientation changes)
    window.addEventListener('resize', handleOrientationChange)
    
    // Listen for orientationchange event (mobile specific)
    window.addEventListener('orientationchange', handleOrientationChange)

    return () => {
      window.removeEventListener('resize', handleOrientationChange)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])

  return deviceInfo
}