import React from 'react'
import ProjectsList from '@/app/components/ProjectsList'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projets Noir et Blanc | Photography Portfolio',
  description:
    'Découvrez ma collection de projets photographiques en noir et blanc.',
}

export default function BlackAndWhiteProjectsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <ProjectsList category="black-and-white" />
    </main>
  )
}
