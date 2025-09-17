'use client'

import React, { useEffect } from 'react'
import Header from '@/components/ui/Header'
import { useMenuStore } from '@/store/menuStore'
import type { MenuData } from '@/components/ui/MenuOverlay/MenuData'
import { reportWebVitals } from '@/lib/web-vitals'

interface ClientLayoutProps {
  children: React.ReactNode
  menuData: MenuData | null
}

export default function ClientLayout({
  children,
  menuData,
}: ClientLayoutProps) {
  const setMenuData = useMenuStore((state) => state.setMenuData)

  // Initialize menu data in store (not fetching, just setting pre-fetched data)
  useEffect(() => {
    if (menuData) {
      setMenuData(menuData)
    }
  }, [menuData, setMenuData])

  // Initialize Web Vitals tracking with built-in Performance API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Simple performance tracking using built-in APIs
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            reportWebVitals({
              name: 'TTFB',
              value: navEntry.responseStart - navEntry.requestStart,
              id: 'ttfb-' + Date.now()
            })
          }
          
          if (entry.entryType === 'paint') {
            const paintEntry = entry as PerformancePaintTiming
            if (paintEntry.name === 'first-contentful-paint') {
              reportWebVitals({
                name: 'FCP',
                value: paintEntry.startTime,
                id: 'fcp-' + Date.now()
              })
            }
          }
          
          if (entry.entryType === 'largest-contentful-paint') {
            const lcpEntry = entry as PerformanceEntry
            reportWebVitals({
              name: 'LCP',
              value: lcpEntry.startTime,
              id: 'lcp-' + Date.now()
            })
          }
        }
      })
      
      // Observe performance entries
      try {
        observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] })
        console.log('📊 Web Vitals tracking initialized (built-in)')
      } catch {
        console.log('📊 Web Vitals tracking not supported')
      }
      
      return () => observer.disconnect()
    }
  }, [])

  return (
    <>
      <Header />
      {children}
    </>
  )
}
