import { useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useTransitionStore } from '@/store/animationStore'

interface UseTransitionNavigationProps {
  onClose?: () => void
}

export function useTransitionNavigation({ 
  onClose
}: UseTransitionNavigationProps = {}) {
  const router = useRouter()
  const { setTransition } = useTransitionStore()
  const [isPending, startTransition] = useTransition()

  const navigateWithTransition = useCallback((path: string) => {
    // Close overlay/menu immediately
    if (onClose) {
      onClose()
    }

    // Set exiting transition state
    setTransition(true, 'exiting')

    // Use React 18+ transition for smooth navigation
    startTransition(() => {
      router.push(path as any) // Type assertion for dynamic paths
    })
  }, [router, setTransition, onClose, startTransition])

  const navigateToProject = useCallback((category: string, slug: string) => {
    navigateWithTransition(`/${category}/${slug}`)
  }, [navigateWithTransition])

  const navigateToCategory = useCallback((category: string) => {
    navigateWithTransition(`/${category}`)
  }, [navigateWithTransition])

  return {
    navigateWithTransition,
    navigateToProject,
    navigateToCategory,
    isPending
  }
}