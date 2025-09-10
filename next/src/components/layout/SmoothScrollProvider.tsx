'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const [contentHeight, setContentHeight] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll()
  
  // Create smooth spring animation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Calculate transform value
  const y = useTransform(
    smoothProgress, 
    [0, 1], 
    [0, contentHeight - windowHeight]
  )

  const transform = useTransform(y, (value) => `translateY(-${value}px)`)

  useEffect(() => {
    const handleResize = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight)
        setWindowHeight(window.innerHeight)
      }
    }

    // Initial calculation
    handleResize()
    
    // Recalculate on resize
    window.addEventListener('resize', handleResize)
    
    // Recalculate when content changes
    const observer = new ResizeObserver(handleResize)
    if (contentRef.current) {
      observer.observe(contentRef.current)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
    }
  }, [])

  // Update scroll height
  useEffect(() => {
    document.body.style.height = `${contentHeight}px`
    return () => {
      document.body.style.height = 'auto'
    }
  }, [contentHeight])

  return (
    <div className="fixed inset-0">
      <motion.div
        ref={contentRef}
        style={{ transform }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  )
}