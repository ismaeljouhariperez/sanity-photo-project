import React from 'react'
import { Metadata } from 'next'
import { createClient } from 'next-sanity'
import ProjectDetail from '@/app/components/ProjectDetail'

type Props = {
  params: Promise<{ slug: string; category: 'black-and-white' | 'early-color' }>
}

// Fonction pour générer les métadonnées dynamiques
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Attendre l'objet params entier
  const resolvedParams = await params
  const category = resolvedParams.category
  const slug = resolvedParams.slug

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5ynkrt2t',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2023-05-03',
    useCdn: process.env.NODE_ENV === 'production',
  })

  try {
    const project = await client.fetch(
      `*[_type == "project" && slug.current == $slug && category == $category][0]{
        title,
        description
      }`,
      { slug, category }
    )

    if (!project) {
      return {
        title: 'Projet non trouvé',
      }
    }

    return {
      title: `${project.title} | Photography Portfolio`,
      description:
        project.description || `Découvrez le projet ${project.title}`,
    }
  } catch (error) {
    console.error('Error fetching project for metadata:', error)
    return {
      title: 'Projet | Photography Portfolio',
    }
  }
}

// Page du projet
export default async function ProjectPage({ params }: Props) {
  // Attendre l'objet params entier
  const resolvedParams = await params
  const category = resolvedParams.category
  const slug = resolvedParams.slug

  return <ProjectDetail slug={slug} category={category} />
}
