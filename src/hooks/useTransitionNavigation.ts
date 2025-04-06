'use client'
import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useProjectsStore } from '@/store'

/**
 * Hook for managing page transitions and navigation
 * Optimizes transitions between project pages for a smoother UX
 */
export function useTransitionNavigation() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  const navigatingRef = useRef(false) // Prevents closure issues

  const { activeCategory, hasFetched } = useProjectsStore()

  const navigateTo = useCallback(
    (url: string, options = { delay: 600 }) => {
      // Skip if already on the target URL
      if (typeof window !== 'undefined' && window.location.pathname === url) {
        return
      }

      // Prevent multiple navigations
      if (isNavigating || navigatingRef.current) return

      navigatingRef.current = true
      setIsNavigating(true)

      // Parse current and target URLs
      const currentPath =
        typeof window !== 'undefined' ? window.location.pathname : ''
      const projectUrlPattern = /\/projects\/([^/]+)\/([^/]+)/
      const categoryUrlPattern = /\/projects\/([^/]+)$/

      const isCurrentlyOnDetailPage = projectUrlPattern.test(currentPath)

      const projectMatch = url.match(projectUrlPattern)
      const categoryMatch = url.match(categoryUrlPattern)

      const isProjectUrl = projectMatch !== null
      const isCategoryUrl = categoryMatch !== null
      const targetCategory = isProjectUrl
        ? projectMatch[1]
        : isCategoryUrl
        ? categoryMatch[1]
        : null

      // Determine if this should be a fast transition
      const isFastTransition =
        // Detail to category list (same category)
        (isCurrentlyOnDetailPage &&
          isCategoryUrl &&
          targetCategory === activeCategory) ||
        // Between projects in the same category
        (isProjectUrl &&
          (targetCategory === activeCategory ||
            (targetCategory &&
              hasFetched[targetCategory as 'black-and-white' | 'early-color'])))

      // For immediate navigations
      if (isFastTransition || options.delay === 0) {
        try {
          router.push(url)
        } catch (error) {
          console.error('Navigation error:', error)
        }

        setTimeout(() => {
          setIsNavigating(false)
          navigatingRef.current = false
        }, 100)

        return
      }

      // For delayed navigations
      setTimeout(() => {
        try {
          router.push(url)
        } catch (error) {
          console.error('Navigation error:', error)
        }

        setTimeout(() => {
          setIsNavigating(false)
          navigatingRef.current = false
        }, 100)
      }, options.delay)
    },
    [router, isNavigating, activeCategory, hasFetched]
  )

  return {
    navigateTo,
    isNavigating,
  }
}
