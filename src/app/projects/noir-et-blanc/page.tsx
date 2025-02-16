'use client'
import React from 'react'
import ProjectsTemplate from '@/app/components/ProjectsTemplate'

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

export default function BWProjects() {
  return <ProjectsTemplate projects={projects} category="noir-et-blanc" />
}
