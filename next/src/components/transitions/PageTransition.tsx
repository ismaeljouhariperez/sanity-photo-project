'use client'
import { motion, cubicBezier } from 'framer-motion'
import { ReactNode, useEffect } from 'react'
import { useAnimationStore } from '@/store/animationStore'
import { usePathname } from 'next/navigation'
import { useProjectsStore } from '@/store/projectsStore'

interface PageTransitionProps {
  children: ReactNode
  className?: string
  overrideTransition?: boolean
}

/**
 * Wrapper component that provides page transition animations
 * Intelligently detects return navigation to disable animations when needed
 */
export default function PageTransition({
  children,
  className = '',
  overrideTransition = false,
}: PageTransitionProps) {
  const { isLeavingPage } = useAnimationStore()
  const pathname = usePathname()
  const previousSlug = useProjectsStore((state) => state.previousSlug)

  // Check if returning from a project detail to a project list
  const isReturningFromDetail =
    previousSlug &&
    (pathname?.includes('/black-and-white') ||
      pathname?.includes('/early-color')) &&
    !pathname?.includes(`/${previousSlug}`)

  // Reset isLeavingPage flag on unmount
  useEffect(() => {
    return () => {
      // Cleanup on unmount
    }
  }, [])

  // If returning from detail to list, skip animations
  if (isReturningFromDetail) {
    return <div className={className}>{children}</div>
  }

  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  // Adjust transitions for smoother animations
  const transition = {
    duration: overrideTransition || isLeavingPage ? 0.2 : 0.5,
    ease: cubicBezier(0.22, 1, 0.36, 1), // Equivalent to GSAP's ease-out-cubic
  }

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={transition}
    >
      {children}
    </motion.div>
  )
}
