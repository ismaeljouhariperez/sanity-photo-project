'use client'
import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

interface InfoOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export default function InfoOverlay({ isOpen, onClose }: InfoOverlayProps) {
  const overlayRef = useRef(null)
  const contentRef = useRef(null)
  
  // Configuration des animations
  const animations = {
    overlay: {
      open: {
        width: '40%',
        duration: 0.8,
        ease: 'power3.inOut',
      },
      close: {
        width: '0%',
        duration: 0.8,
        delay: 0,
        ease: 'power3.inOut',
      }
    },
    content: {
      open: {
        opacity: 1,
        duration: 0.6,
        delay: 0.8,
        ease: 'power2.out',
      },
      close: {
        opacity: 0,
        duration: 0.3,
      }
    }
  }

  // État initial
  useGSAP(() => {
    gsap.set(overlayRef.current, { width: '0%' })
    gsap.set(contentRef.current, { opacity: 0 })
  }, [])

  // Animation de fermeture
  const animateClose = (timeline: gsap.core.Timeline) => {
    timeline
      .to(contentRef.current, animations.content.close)
      .to(overlayRef.current, {
        ...animations.overlay.close,
        onComplete: () => onClose()
      }, "<=0.2")
  }

  // Animation principale
  useEffect(() => {
    const tl = gsap.timeline()
    
    const ctx = gsap.context(() => {
      if (isOpen) {
        tl.to(overlayRef.current, animations.overlay.open)
          .to(contentRef.current, animations.content.open, "<=0.2")
      } else {
        animateClose(tl)
      }
    })
    
    return () => ctx.revert()
  }, [isOpen, onClose])

  return (
    <div 
      ref={overlayRef} 
      className="fixed top-0 left-0 h-full bg-black z-50 text-white overflow-hidden"
    >
      <button 
        onClick={() => animateClose(gsap.timeline())}
        className="absolute top-8 right-8 text-white"
      >
        Close
      </button>
      
      <div ref={contentRef} className="mt-16">
        <h2 className="text-2xl mb-4">À propos</h2>
        {/* Ajoutez ici votre contenu */}
        <p>Votre contenu ici...</p>
      </div>
    </div>
  )
} 