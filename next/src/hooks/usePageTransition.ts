import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { startTransition } from 'react'
import { useTransitionStore } from '@/store/transitionStore'

/**
 * Custom hook for page transitions with View Transitions API
 * Following React 19 best practices for state management and cleanup
 */
export function usePageTransition() {
  const router = useRouter()
  const { setTransition } = useTransitionStore()
  const [isExiting, setIsExiting] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const navigateWithTransition = useCallback(async (path: string, delay: number = 800) => {
    try {
      setIsExiting(true)
      setTransition(true, 'exiting')
      
      // Use ref to track timeout for cleanup
      timeoutRef.current = setTimeout(() => {
        if ('startViewTransition' in document) {
          // Use View Transitions API when available
          (document as Document & { startViewTransition?: (callback: () => void) => void }).startViewTransition!(() => {
            startTransition(() => {
              router.push(path)
            })
          })
        } else {
          // Fallback for browsers without View Transitions
          startTransition(() => {
            router.push(path)
          })
        }
        
        // Don't reset isExiting - let the component unmount naturally
        // The new page will have its own fresh state
        setTransition(false, null)
      }, delay)
    } catch (error) {
      console.error('Navigation error:', error)
      
      // Fallback navigation on error
      startTransition(() => {
        router.push(path)
      })
      
      // Only reset on error
      setIsExiting(false)
      setTransition(false, null)
    }
  }, [router, setTransition])

  // Cleanup function for manual cleanup if needed
  const cancelTransition = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      setIsExiting(false)
      setTransition(false, null)
    }
  }, [setTransition])

  return {
    navigateWithTransition,
    cancelTransition,
    isExiting
  }
}