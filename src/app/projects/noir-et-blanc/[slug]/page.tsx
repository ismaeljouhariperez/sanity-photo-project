'use client'
import React from 'react'
import { notFound } from 'next/navigation'

interface Props {
  params: {
    slug: string
  }
}

const projects = [
  "L'herbe des nuits",
  'New York',
  'La grande plage',
  'Les toits',
  'Brumes',
  'Solitude',
  'Les falaises',
  "Portraits d'hiver",
  'Le port',
  'Nuit blanche',
]

export default function BWProject({ params }: Props) {
  const project = projects.find(
    (p) => p.toLowerCase().replace(/\s+/g, '-') === params.slug
  )

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-[calc(100vh-5.5rem)] p-8">
      <h1 className="text-4xl mb-8">{project}</h1>
      {/* Contenu du projet à venir */}
    </div>
  )
}
