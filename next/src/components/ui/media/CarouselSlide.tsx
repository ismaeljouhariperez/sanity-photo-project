'use client'

import { ReactNode } from 'react'
import styles from './ProjectSlider.module.css'

interface CarouselSlideProps {
  isActive: boolean
  children: ReactNode
  className?: string
}

export default function CarouselSlide({ isActive, children, className = '' }: CarouselSlideProps) {
  return (
    <div className={`${styles.emblaSlide} ${isActive ? styles.active : ''} ${className}`}>
      {children}
    </div>
  )
}