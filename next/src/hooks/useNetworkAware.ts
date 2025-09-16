'use client'

import { useState, useEffect } from 'react'

interface NetworkState {
  isOnline: boolean
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown'
  downlink: number
  saveData: boolean
  isSlowConnection: boolean
}

export function useNetworkAware(): NetworkState {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isOnline: true,
    effectiveType: 'unknown',
    downlink: 0,
    saveData: false,
    isSlowConnection: false,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateNetworkState = () => {
      const isOnline = navigator.onLine
      
      // Use Network Information API if available
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection

      let effectiveType: NetworkState['effectiveType'] = 'unknown'
      let downlink = 0
      let saveData = false

      if (connection) {
        effectiveType = connection.effectiveType || 'unknown'
        downlink = connection.downlink || 0
        saveData = connection.saveData || false
      }

      // Consider connection slow if:
      // - Save Data is enabled
      // - Effective type is 2g or slow-2g
      // - Downlink is less than 1.5 Mbps
      const isSlowConnection = saveData || 
                              effectiveType === '2g' || 
                              effectiveType === 'slow-2g' ||
                              (downlink > 0 && downlink < 1.5)

      setNetworkState({
        isOnline,
        effectiveType,
        downlink,
        saveData,
        isSlowConnection,
      })
    }

    // Initial check
    updateNetworkState()

    // Listen for network changes
    window.addEventListener('online', updateNetworkState)
    window.addEventListener('offline', updateNetworkState)

    // Listen for connection changes if supported
    const connection = (navigator as any).connection
    if (connection) {
      connection.addEventListener('change', updateNetworkState)
    }

    return () => {
      window.removeEventListener('online', updateNetworkState)
      window.removeEventListener('offline', updateNetworkState)
      
      if (connection) {
        connection.removeEventListener('change', updateNetworkState)
      }
    }
  }, [])

  return networkState
}