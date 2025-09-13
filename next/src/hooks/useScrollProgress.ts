'use client'

import { useRef, useEffect, useState } from 'react'
import { useScroll, useTransform, MotionValue } from 'framer-motion'

interface UseScrollProgressOptions {
  offset?: ["start end", "end start"] | ["start start", "end start"] | [string, string]
}

export function useScrollProgress<T extends HTMLElement = HTMLElement>(options: UseScrollProgressOptions = {}) {
  const ref = useRef<T>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const { scrollYProgress } = useScroll({
    target: isHydrated ? ref : undefined,
    offset: options.offset || ["start end", "end start"] as const
  })

  return { ref, scrollYProgress, isHydrated }
}

export function useParallaxTransform(
  scrollYProgress: MotionValue<number>,
  input: number[] | [number, number],
  output: string[] | [string, string],
  shouldDisable: boolean = false
) {
  return useTransform(
    scrollYProgress,
    input,
    shouldDisable ? [output[0], output[0]] : output
  )
}