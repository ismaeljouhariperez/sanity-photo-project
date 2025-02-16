'use client'
import React from 'react'
import ProjectsTemplate from '@/app/components/ProjectsTemplate'

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

export default function ColorProjects() {
  return <ProjectsTemplate projects={projects} category="couleur" />
}
