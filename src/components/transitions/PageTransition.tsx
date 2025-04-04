'use client'
import { motion } from 'framer-motion'
import { ReactNode, useEffect } from 'react'
import { useAnimationStore } from '@/store/animationStore'
import { usePathname } from 'next/navigation'
import { useProjectsStore } from '@/store'

interface PageTransitionProps {
  children: ReactNode
  className?: string
  overrideTransition?: boolean
}

export default function PageTransition({
  children,
  className = '',
  overrideTransition = false,
}: PageTransitionProps) {
  const { isLeavingPage } = useAnimationStore()
  const pathname = usePathname()
  const previousSlug = useProjectsStore((state) => state.previousSlug)

  // Vérifier si on revient d'une page de détail à une liste de projets
  const isReturningFromDetail =
    previousSlug &&
    pathname?.includes('/projects/') &&
    !pathname?.includes(`/${previousSlug}`)

  // Reset le flag isLeavingPage lors du démontage
  useEffect(() => {
    return () => {
      // Nettoyage lors du démontage
    }
  }, [])

  // Si on revient de détail à liste, ne pas animer
  if (isReturningFromDetail) {
    return <div className={className}>{children}</div>
  }

  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  // Ajuster les transitions pour les rendre plus fluides
  const transition = {
    duration: overrideTransition || isLeavingPage ? 0.2 : 0.5,
    ease: [0.22, 1, 0.36, 1], // Équivalent de l'ease-out-cubic de GSAP
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
