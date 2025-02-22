'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface AnimatedTitleProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export default function AnimatedTitle({
  children,
  className,
  delay = 0,
}: AnimatedTitleProps) {
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        {
          y: -50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          delay: delay,
        }
      )
    }
  }, [delay])

  return (
    <div className="overflow-hidden">
      <div ref={titleRef} className={className}>
        {children}
      </div>
    </div>
  )
}
