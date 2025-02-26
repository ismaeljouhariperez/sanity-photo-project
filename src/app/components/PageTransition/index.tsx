'use client'
import { useEffect } from 'react'
import barba from '@barba/core'
import gsap from 'gsap'
import { useAnimationStore } from '@/store/animationStore'

interface PreventElement extends Element {
  href?: string
}

export default function PageTransition() {
  const { resetHeaderAnimation, setInProjectsSection } = useAnimationStore()

  // Initialize state based on current URL
  useEffect(() => {
    const isInProjects = window.location.pathname.includes('/projects')
    setInProjectsSection(isInProjects)
  }, [setInProjectsSection])

  useEffect(() => {
    barba.init({
      // @ts-expect-error - Barba types are incomplete
      prevent: ({ el }: { el: PreventElement }) => {
        // Prevent Barba from handling links with apostrophes
        const href = el.href || ''
        return href.includes("'")
      },
      transitions: [
        {
          name: 'default-transition',
          async: function () {
            return this.async()
          },
          async leave(data) {
            const done = this.async()
            const isLeavingProjects =
              data.current.url.path?.includes('/projects')
            const isGoingToProjects = data.next.url.path?.includes('/projects')

            console.log('--- LEAVE ---')
            console.log('Current URL:', data.current.url.path)
            console.log('Next URL:', data.next.url.path)
            console.log('isLeavingProjects:', isLeavingProjects)
            console.log('isGoingToProjects:', isGoingToProjects)

            if (isLeavingProjects && !isGoingToProjects) {
              console.log('⚠️ Réinitialisation des animations')
              await gsap.to(data.current.container.querySelector('.title'), {
                opacity: 0,
                y: -50,
                duration: 0.5,
              })
              resetHeaderAnimation()
              setInProjectsSection(false)
            }

            gsap.to(data.current.container, {
              opacity: 0,
              y: -50,
              duration: 0.5,
              onComplete: done,
            })
          },
          async enter(data) {
            const done = this.async()
            const isEnteringProjects = data.next.url.path?.includes('/projects')

            console.log('--- ENTER ---')
            console.log('New URL:', data.next.url.path)
            console.log('isEnteringProjects:', isEnteringProjects)

            if (isEnteringProjects) {
              console.log('🎯 Activation section projects')
              setInProjectsSection(true)
            }

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
  }, [resetHeaderAnimation, setInProjectsSection])

  return null
}
