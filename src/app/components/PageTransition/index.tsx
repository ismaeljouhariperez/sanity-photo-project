'use client'
import { useEffect } from 'react'
import barba from '@barba/core'
import gsap from 'gsap'
import { useAnimationStore } from '@/store/animationStore'

type DoneCallback = () => void

export default function PageTransition() {
  const { resetHeaderAnimation } = useAnimationStore()

  useEffect(() => {
    barba.init({
      transitions: [
        {
          name: 'default-transition',
          async: function () {
            return this.async()
          },
          async leave(data) {
            const done = this.async() as DoneCallback
            // Réinitialise l'animation si on quitte une page de projet
            if (data.current.url.path?.includes('/projects/')) {
              resetHeaderAnimation()
            }

            gsap.to(data.current.container, {
              opacity: 0,
              y: -50,
              duration: 0.5,
              onComplete: done,
            })
          },
          async enter(data) {
            const done = this.async() as DoneCallback
            gsap.fromTo(
              data.next.container,
              {
                opacity: 0,
                y: 50,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                onComplete: done,
              }
            )
          },
        },
      ],
    })
  }, [resetHeaderAnimation])

  return null
}
