import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTransitionStore } from '@/store/transitionStore'

interface UseTransitionNavigationProps {
  onClose?: () => void
  navigationDelay?: number
}

export function useTransitionNavigation({ 
  onClose, 
  navigationDelay = 300 
}: UseTransitionNavigationProps = {}) {
  const router = useRouter()
  const { setTransition } = useTransitionStore()

  const navigateWithTransition = useCallback((path: string) => {
    // Set exiting transition state
    setTransition(true, 'exiting')

    // Close overlay/menu if provided
    if (onClose) {
      onClose()
    }

    // Small delay to let animations start before navigation
    setTimeout(() => {
      router.push(path as `/black-and-white` | `/early-color` | `/${string}/${string}`) // Type assertion for typed routes compatibility
    }, navigationDelay)
  }, [router, setTransition, onClose, navigationDelay])

  const navigateToProject = useCallback((category: string, slug: string) => {
    navigateWithTransition(`/${category}/${slug}`)
  }, [navigateWithTransition])

  const navigateToCategory = useCallback((category: string) => {
    navigateWithTransition(`/${category}`)
  }, [navigateWithTransition])

  return {
    navigateWithTransition,
    navigateToProject,
    navigateToCategory
  }
}