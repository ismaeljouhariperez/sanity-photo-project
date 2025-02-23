'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useAnimationStore } from '@/store/animationStore'

interface AnimatedTitleProps {
  children: React.ReactNode
  className?: string
  delay?: number
  isHeader?: boolean
}

export default function AnimatedTitle({
  children,
  className,
  delay = 0,
  isHeader = false,
}: AnimatedTitleProps) {
  const titleRef = useRef<HTMLDivElement>(null)
  const hasAnimatedRef = useRef(false)
  const {
    hasPlayedHeaderAnimation,
    setHeaderAnimationPlayed,
    resetHeaderAnimation,
  } = useAnimationStore()

  useEffect(() => {
    if (!titleRef.current || hasAnimatedRef.current) return

    if (isHeader && hasPlayedHeaderAnimation) {
      gsap.set(titleRef.current, {
        y: 0,
        opacity: 1,
      })
      return
    }

    hasAnimatedRef.current = true
    gsap.fromTo(
      titleRef.current,
      { y: -50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: delay,
        onComplete: () => {
          if (isHeader) {
            setHeaderAnimationPlayed()
          }
        },
      }
    )

    return () => {
      if (isHeader) {
        resetHeaderAnimation()
      }
    }
  }, [
    delay,
    isHeader,
    hasPlayedHeaderAnimation,
    setHeaderAnimationPlayed,
    resetHeaderAnimation,
  ])

  return (
    <div className="overflow-hidden">
      <div ref={titleRef} className={className}>
        {children}
      </div>
    </div>
  )
}
