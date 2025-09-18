'use client'

interface WebVitalMetric {
  name: string
  value: number
  id: string
}

export function reportWebVitals(metric: WebVitalMetric) {
  // Only track in development mode to avoid performance overhead
  if (process.env.NODE_ENV !== 'development') {
    return
  }
  
  // Track only critical metrics to reduce console noise
  switch (metric.name) {
    case 'LCP':
      if (metric.value > 2500) {
        console.warn(`⚠️ LCP too slow: ${metric.value.toFixed(0)}ms (target: <2500ms)`)
      }
      break
      
    case 'FCP':
      if (metric.value > 1800) {
        console.warn(`⚠️ FCP too slow: ${metric.value.toFixed(0)}ms (target: <1800ms)`)
      }
      break
      
    case 'CLS':
      if (metric.value > 0.1) {
        console.warn(`⚠️ CLS too high: ${metric.value.toFixed(3)} (target: <0.1)`)
      }
      break
  }
  
  // Send to analytics in production (optional)
  // if (process.env.NODE_ENV === 'production') {
  //   // You can send metrics to your analytics service here
  //   // gtag('event', metric.name, { ... })
  // }
}

// Helper function to track image loading performance
export function trackImageLoad(imageSrc: string, loadTime: number) {
  console.log(`🖼️ Image loaded: ${imageSrc.substring(0, 50)}... in ${loadTime}ms`)
  
  if (loadTime > 3000) {
    console.warn(`⚠️ Slow image load: ${loadTime}ms`)
  }
}

// Helper function to track navigation performance
export function trackNavigation(from: string, to: string, duration: number) {
  if (duration > 500) {
    console.warn(`⚠️ Slow navigation: ${from} → ${to} in ${duration}ms`)
  }
}