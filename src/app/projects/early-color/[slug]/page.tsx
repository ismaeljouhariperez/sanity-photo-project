'use client'
import React from 'react'
import { notFound } from 'next/navigation'

interface Props {
  params: {
    slug: string
  }
}

const projects = [
  'Les jardins',
  'Méditerranée',
  'Rouge vif',
  'Les serres',
  'Printemps',
  'La ville dorée',
  'Fleurs sauvages',
  "L'aube",
  'Rivages',
  'Le marché',
]

type PageParams = {
  params: Promise<{ slug: string }>
}

export default function EarlyColorProjectPage({ params }: PageParams) {
  const resolvedParams = React.use(params)
  const project = projects.find(
    (p) => p.toLowerCase().replace(/\s+/g, '-') === resolvedParams.slug
  )

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-[calc(100vh-5.5rem)] p-8">
      <h1 className="text-4xl mb-8">{project}</h1>
    </div>
  )
}
