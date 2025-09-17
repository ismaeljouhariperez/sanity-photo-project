'use client'

import { useEffect } from 'react'

export function PhotographyPerformanceMonitor() {
  useEffect(() => {
    // Monitor Largest Contentful Paint specifically for images
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          const lcpEntry = entry as PerformanceEntry & { element?: Element }
          
          // Check if LCP element is an image (critical for photography sites)
          if (lcpEntry.element?.tagName === 'IMG') {
            const lcpTime = entry.startTime
            
            // Photography site should have LCP < 2500ms for good UX
            if (lcpTime > 2500) {
              console.warn(`⚠️ Photography LCP too slow: ${lcpTime.toFixed(0)}ms (target: <2500ms)`)
            }
            
            // Track image format for optimization insights
            const img = lcpEntry.element as HTMLImageElement
            if (img.src.includes('.jpg') || img.src.includes('.jpeg')) {
              console.warn('📸 LCP image is JPEG - consider WebP/AVIF for better compression')
            }
          }
        }
      }
    })

    try {
      observer.observe({ type: 'largest-contentful-paint', buffered: true })
    } catch (error) {
      // Fallback for older browsers
      console.log('Performance monitoring not supported')
    }

    return () => observer.disconnect()
  }, [])

  return null
}