'use client'
import { useEffect } from 'react'
import barba from '@barba/core'

export default function PageTransition() {
  useEffect(() => {
    barba.init({
      transitions: [
        {
          name: 'opacity-transition',
          leave(data) {
            return new Promise((resolve) => {
              const leaving = data.current.container
              leaving.style.opacity = '0'
              setTimeout(resolve, 300)
            })
          },
          enter(data) {
            return new Promise((resolve) => {
              const entering = data.next.container
              entering.style.opacity = '1'
              setTimeout(resolve, 300)
            })
          },
        },
      ],
    })
  }, [])

  return null
}
