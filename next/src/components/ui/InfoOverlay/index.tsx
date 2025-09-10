'use client'
import { motion, AnimatePresence } from 'framer-motion'

interface InfoOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export default function InfoOverlay({ isOpen, onClose }: InfoOverlayProps) {
  // Slowed down animation configurations
  const overlayAnimations = {
    initial: {
      width: 0,
    },
    animate: {
      width: '40%',
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: {
      width: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
        delay: 0.3,
      },
    },
  }

  // Content animation with longer delay
  const contentAnimations = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 1.0,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed left-0 top-0 z-50 h-full overflow-hidden bg-gray-900 text-gray-100"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={overlayAnimations}
        >
          <motion.button
            onClick={onClose}
            className="absolute right-8 top-8 text-white"
            variants={contentAnimations}
          >
            Fermer
          </motion.button>

          <motion.div
            className="mt-16 h-full overflow-y-auto p-8"
            variants={contentAnimations}
          >
            <h2 className="mb-8 text-3xl font-light">À propos</h2>

            <div className="space-y-5 leading-relaxed text-gray-300">
              <p>
                Ismael León est né à Marseille et vit actuellement à Bordeaux.
                Autodidacte, il a voyagé en Amérique du Nord et du Sud, de
                Montréal au Pérou jusqu&apos;en Argentine.
              </p>

              <p>
                Son travail explore l&apos;errance, la lumière et la géométrie
                dans une approche du réalisme magique. Inspiré par Larry Sultan,
                Alec Soth ou Alessandra Sanguinetti, il navigue entre
                documentaire et photographie de rue.
              </p>

              <p>
                Il travaille actuellement sur un livre photographique qui
                retrace ses errances et rencontres.
              </p>

              <div className="mt-8 border-t border-gray-700 pt-6">
                <p className="mb-4">
                  <span className="text-gray-400">Contact :</span>
                  <br />
                  <a
                    href="mailto:contact@ismaelleon.com"
                    className="text-gray-100 transition-colors hover:text-white"
                  >
                    contact@ismaelperez.com
                  </a>
                </p>

                <p className="mb-4">
                  <a
                    href="https://instagram.com/hypsanda"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-100 transition-colors hover:text-white"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                </p>
                <p className="mt-6 text-sm text-gray-400">
                  Disponible pour des commissions commerciales et éditoriales à
                  Bordeaux et Paris.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
