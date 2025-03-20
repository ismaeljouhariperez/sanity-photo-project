import React from 'react'
import ProjectsList from '@/app/components/ProjectsList'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projets Couleur | Photography Portfolio',
  description: 'Découvrez ma collection de projets photographiques en couleur.',
}

export default function ColorProjectsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <ProjectsList category="early-color" />
    </main>
  )
}
