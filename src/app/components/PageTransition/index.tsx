'use client'
import { useEffect } from 'react'
import barba from '@barba/core'
import gsap from 'gsap'

type DoneCallback = () => void

export default function PageTransition() {
  useEffect(() => {
    barba.init({
      transitions: [
        {
          name: 'default-transition',
          async: () => Promise.resolve(),
          async leave(data) {
            const done = this.async() as DoneCallback
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
  }, [])

  return null
}
