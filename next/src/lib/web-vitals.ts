'use client'

interface WebVitalMetric {
  name: string
  value: number
  id: string
}

export function reportWebVitals(metric: WebVitalMetric) {
  // Track metrics in production mode only for critical issues
  
  // Track critical metrics for photography portfolio
  switch (metric.name) {
    case 'LCP':
      // Largest Contentful Paint - Critical for image loading
      if (metric.value > 2500) {
        console.warn(`⚠️ LCP too slow: ${metric.value}ms (target: <2500ms)`)
      }
      break
      
    case 'CLS':
      // Cumulative Layout Shift - Important for gallery stability
      if (metric.value > 0.1) {
        console.warn(`⚠️ CLS too high: ${metric.value} (target: <0.1)`)
      }
      break
      
    case 'INP':
      // Interaction to Next Paint - User interaction responsiveness (replaces FID)
      if (metric.value > 200) {
        console.warn(`⚠️ INP too slow: ${metric.value}ms (target: <200ms)`)
      }
      break
      
    case 'FCP':
      // First Contentful Paint - Initial loading perception
      if (metric.value > 1800) {
        console.warn(`⚠️ FCP too slow: ${metric.value}ms (target: <1800ms)`)
      }
      break
      
    case 'TTFB':
      // Time to First Byte - Server response time
      if (metric.value > 800) {
        console.warn(`⚠️ TTFB too slow: ${metric.value}ms (target: <800ms)`)
      }
      break
  }
  
  // Send to analytics in production (optional)
  if (process.env.NODE_ENV === 'production') {
    // You can send metrics to your analytics service here
    // gtag('event', metric.name, {
    //   event_category: 'Web Vitals',
    //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    //   event_label: metric.id,
    //   non_interaction: true,
    // })
  }
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