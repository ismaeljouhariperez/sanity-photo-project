'use client'

import { motion } from 'framer-motion'
import { MenuData } from './MenuData'
import ProjectSection from './ProjectSection'

interface MenuContentProps {
  data: MenuData
  onClose: () => void
}

export default function MenuContent({ data, onClose }: MenuContentProps) {
  // Animation variants
  const overlayVariants = {
    hidden: {
      y: '-100%',
    },
    visible: {
      y: 0,
      transition: {
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1] as const, // Smooth custom bezier
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.8,
        delay: 0.15,
        ease: [0.7, 0, 0.84, 0] as const,
      },
    },
  }

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.4,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1,
        duration: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.25,
        ease: [0.7, 0, 0.84, 0] as const,
      },
    },
  }

  const countVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut' as const,
      },
    },
  }

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-cream pt-header fixed inset-0 z-40"
    >
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="pt-header container mx-auto h-full py-12"
      >
        <div className="grid h-full grid-cols-2 gap-16">
          <ProjectSection
            title="Black and White Projects"
            projects={data.blackAndWhiteProjects}
            category="black-and-white"
            itemVariants={itemVariants}
            listVariants={listVariants}
            countVariants={countVariants}
            onClose={onClose}
          />

          <ProjectSection
            title="Early Color Projects"
            projects={data.earlyColorProjects}
            category="early-color"
            itemVariants={itemVariants}
            listVariants={listVariants}
            countVariants={countVariants}
            onClose={onClose}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
