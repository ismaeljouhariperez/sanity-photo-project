'use client'
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
      <div className="w-full max-w-7xl mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8 px-8">Projets Couleur</h1>
        <ProjectsList category="early-color" />
      </div>
    </main>
  )
}
