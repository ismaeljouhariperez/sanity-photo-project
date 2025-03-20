'use client'
import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { useAnimationStore } from '@/store/animationStore'

interface PreventElement extends Element {
  href?: string
}

interface BarbaData {
  current: {
    container: HTMLElement
    url: {
      path?: string
    }
  }
  next: {
    container: HTMLElement
    url: {
      path?: string
    }
  }
}

interface PageTransitionProps {
  isEnabled?: boolean
}

export default function PageTransition({
  isEnabled = true,
}: PageTransitionProps) {
  const { resetHeaderAnimation, setInProjectsSection } = useAnimationStore()
  const [barba, setBarba] = useState<any>(null)

  // Traquer si on est déjà en train de naviguer pour éviter les actions multiples
  const [isNavigating, setIsNavigating] = useState(false)

  // useRef pour éviter les problèmes liés aux fermetures (closures)
  const isNavigatingRef = useRef(false)

  // Initialize state based on current URL
  useEffect(() => {
    const isInProjects = window.location.pathname.includes('/projects')
    setInProjectsSection(isInProjects)
  }, [setInProjectsSection])

  // Dynamically import barba.js only on the client
  useEffect(() => {
    const loadBarba = async () => {
      try {
        const barbaModule = await import('@barba/core')
        setBarba(barbaModule.default)
      } catch (error) {
        console.error('Failed to load barba.js:', error)
      }
    }

    if (isEnabled) {
      loadBarba()
    }
  }, [isEnabled])

  // Initialize barba after it's loaded
  useEffect(() => {
    // Si barba n'est pas chargé ou est désactivé, ne pas initialiser
    if (!barba || !isEnabled) {
      console.log('Barba.js est', !barba ? 'non chargé' : 'désactivé')
      return
    }

    console.log('Initialisation de Barba.js')

    // Réinitialiser l'état de navigation au début
    setIsNavigating(false)
    isNavigatingRef.current = false

    barba.init({
      prevent: ({ el }: { el: PreventElement }) => {
        // Vérifier si une navigation est déjà en cours
        if (isNavigatingRef.current) {
          console.log(
            '⚠️ Navigation déjà en cours - prévention de transition supplémentaire'
          )
          return true
        }

        // Prevent Barba from handling links with apostrophes or project links
        const href = el.href || ''
        const preventForApostrophe = href.includes("'")

        // Désactiver Barba pour les pages de projet
        const isProjectDetailPage =
          href.includes('/projects/') &&
          (href.includes('/black-and-white/') || href.includes('/early-color/'))

        // Désactiver Barba pour les navigations vers la page d'accueil
        const isHomePage = href.endsWith('/') && !href.includes('/projects/')

        // Désactiver Barba pour les navigations entre catégories de projets
        // pour éviter des problèmes de montage/démontage cyclique
        const isProjectCategoryPage =
          href.includes('/projects/black-and-white') ||
          href.includes('/projects/early-color')

        const isNavigatingBetweenCategories =
          window.location.pathname.includes('/projects/') &&
          isProjectCategoryPage &&
          !window.location.pathname.includes(href)

        if (isProjectDetailPage) {
          console.log(
            'Barba.js est désactivé pour cette navigation vers projet:',
            href
          )
        }

        if (isHomePage) {
          console.log(
            'Barba.js est désactivé pour cette navigation vers accueil'
          )
        }

        if (isNavigatingBetweenCategories) {
          console.log(
            'Barba.js est désactivé pour cette navigation entre catégories:',
            window.location.pathname,
            '->',
            href
          )
        }

        return (
          preventForApostrophe ||
          isProjectDetailPage ||
          isHomePage ||
          isNavigatingBetweenCategories
        )
      },
      transitions: [
        {
          name: 'default-transition',
          async: function (): Promise<() => void> {
            return this.async()
          },
          async leave(data: BarbaData) {
            const done = this.async()

            // Marquer que nous sommes en train de naviguer
            setIsNavigating(true)

            const isLeavingProjects =
              data.current.url.path?.includes('/projects')
            const isGoingToProjects = data.next.url.path?.includes('/projects')

            console.log('--- LEAVE ---')
            console.log('Current URL:', data.current.url.path)
            console.log('Next URL:', data.next.url.path)

            if (isLeavingProjects && !isGoingToProjects) {
              console.log('⚠️ Réinitialisation des animations')
              const titleElement =
                data.current.container.querySelector('.title')
              if (titleElement) {
                await gsap.to(titleElement, {
                  opacity: 0,
                  y: -50,
                  duration: 0.5,
                })
              }
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
          async enter(data: BarbaData) {
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
                onComplete: () => {
                  // Marquer que la navigation est terminée
                  setIsNavigating(false)
                  done()
                },
              }
            )
          },
        },
      ],
    })

    return () => {
      if (barba && barba.destroy) {
        console.log('Destruction de Barba.js')
        barba.destroy()
      }
    }
  }, [
    barba,
    resetHeaderAnimation,
    setInProjectsSection,
    isEnabled,
    isNavigating,
  ])

  return null
}
