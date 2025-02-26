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
  const {
    hasPlayedHeaderAnimation,
    isInProjectsSection,
    setHeaderAnimationPlayed,
  } = useAnimationStore()

  useEffect(() => {
    if (!titleRef.current) return

    console.log('--- AnimatedTitle Effect ---')
    console.log('isHeader:', isHeader)
    console.log('isInProjectsSection:', isInProjectsSection)
    console.log('hasPlayedHeaderAnimation:', hasPlayedHeaderAnimation)

    if (isHeader && isInProjectsSection) {
      if (hasPlayedHeaderAnimation) {
        console.log('✅ Animation déjà jouée, on garde la position')
        gsap.set(titleRef.current, {
          y: 0,
          opacity: 1,
        })
        return
      }

      console.log('🔄 Première animation dans projects')
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
            setHeaderAnimationPlayed()
          },
        }
      )
      return
    }

    console.log('⚡ Animation standard')
    gsap.fromTo(
      titleRef.current,
      { y: -50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: delay,
      }
    )
  }, [
    delay,
    isHeader,
    hasPlayedHeaderAnimation,
    isInProjectsSection,
    setHeaderAnimationPlayed,
  ])

  return (
    <div className="overflow-hidden">
      <div ref={titleRef} className={className}>
        {children}
      </div>
    </div>
  )
}
