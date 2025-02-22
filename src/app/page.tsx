'use client'
import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import ImageKitImage from './components/ImageKitImage'

export default function Home() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const leftImageRef = useRef<HTMLDivElement>(null)
  const rightImageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.set([leftImageRef.current, rightImageRef.current], {
      opacity: 0,
      y: 100,
      scale: 0.9,
    })
      .to(containerRef.current, {
        opacity: 1,
        duration: 0.1,
      })
      .to(leftImageRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
      })
      .to(
        rightImageRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
        },
        '-=0.9'
      )
  }, [])

  const handleNavigate = (path: string) => {
    // Animation de sortie
    const tl = gsap.timeline({
      onComplete: () => router.push(path),
    })

    const isLeft = path.includes('black-and-white')
    const exitX = isLeft ? -100 : 100

    tl.to([leftImageRef.current, rightImageRef.current], {
      opacity: 0,
      x: exitX,
      scale: 0.95,
      duration: 0.7,
      stagger: 0.1,
    })
  }

  return (
    <div
      ref={containerRef}
      className="opacity-0 h-[calc(100vh-5.5rem)] grid grid-cols-2 gap-4 p-4 items-center justify-items-center"
    >
      <div
        ref={leftImageRef}
        className="relative flex items-center w-80 aspect-[3/4] cursor-pointer overflow-hidden"
        onClick={() => handleNavigate('/projects/black-and-white')}
      >
        <div className="w-full h-full transform hover:scale-105 transition-transform duration-500">
          <ImageKitImage
            src="default-image.jpg"
            alt="Black and White Photography"
            width={800}
            height={600}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <div
        ref={rightImageRef}
        className="relative flex items-center w-80 aspect-[3/4] cursor-pointer overflow-hidden"
        onClick={() => handleNavigate('/projects/early-color')}
      >
        <div className="w-full h-full transform hover:scale-105 transition-transform duration-500">
          <ImageKitImage
            src="default-image.jpg"
            alt="Early Color Photography"
            width={800}
            height={600}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  )
}
