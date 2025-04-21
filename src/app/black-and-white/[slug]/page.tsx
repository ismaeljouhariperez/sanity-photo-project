import { Metadata } from 'next'
import { createClient } from 'next-sanity'
import ProjectDetailClient from '@/app/components/ProjectDetailClient'

type Props = {
  params: Promise<{ slug: string }> | { slug: string }
}

// Fonction pour générer les métadonnées dynamiques
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Attendre la résolution des paramètres s'ils sont une Promise
  const resolvedParams = await Promise.resolve(params)
  const slug = resolvedParams.slug
  const category = 'black-and-white'

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

// Page du projet (serveur)
export default async function ProjectPage({ params }: Props) {
  // Attendre la résolution des paramètres s'ils sont une Promise
  const resolvedParams = await Promise.resolve(params)
  const slug = resolvedParams.slug

  return <ProjectDetailClient slug={slug} category="black-and-white" />
}
