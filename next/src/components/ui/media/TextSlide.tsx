'use client'

import { motion } from 'framer-motion'
import type { Project } from '@/lib/sanity.types'

interface TextSlideProps {
  project: Project
}

export default function TextSlide({ project }: TextSlideProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.div
        className="container pointer-events-none mx-auto max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: [0.16, 1, 0.3, 1] as const,
        }}
      >
        {/* Project Title */}
        <motion.h2
          className="font-lightÏ mb-6 text-center text-2xl text-gray-900 md:text-3xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.4,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
        >
          {project.title}
        </motion.h2>

        {/* Project Description */}
        {project.description && (
          <motion.div
            className="prose prose-gray mx-auto max-w-xl text-base leading-relaxed text-gray-700 md:text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.6,
              ease: [0.16, 1, 0.3, 1] as const,
            }}
          >
            <p>{project.description}</p>
          </motion.div>
        )}

        {/* Subtle indicator this is the final slide */}
        <motion.div
          className="mx-auto mt-8 h-px w-16 bg-gray-300"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.8,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
        />
      </motion.div>
    </div>
  )
}
