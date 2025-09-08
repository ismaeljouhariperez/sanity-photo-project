import { Metadata } from 'next'
import { getProjectBySlug, getSiteSettings } from '@/lib/sanity'
import { generateProjectMetadata } from '@/lib/seo'
import { isValidCategory } from '@/lib/constants'
import { notFound } from 'next/navigation'

interface ProjectPageProps {
  params: Promise<{ category: string; slug: string }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  try {
    const { category, slug } = await params
    
    if (!isValidCategory(category)) {
      return {
        title: 'Page non trouvée',
        description: 'La page demandée n\'existe pas.',
      }
    }

    const [project, siteSettings] = await Promise.all([
      getProjectBySlug(slug, category),
      getSiteSettings()
    ])

    if (!project) {
      return {
        title: 'Projet non trouvé',
        description: 'Le projet demandé n\'existe pas.',
      }
    }

    return generateProjectMetadata({
      ...project,
      category,
      slug,
    }, siteSettings)
  } catch (error) {
    console.error('Error generating project metadata:', error)
    return {
      title: 'Erreur',
      description: 'Une erreur s\'est produite lors du chargement du projet.',
    }
  }
}

/**
 * Project detail page - displays same content as category list for now
 * Will evolve later with different content/animations
 */
export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { category, slug } = await params
  
  if (!isValidCategory(category)) {
    notFound()
  }

  // Verify project exists
  const project = await getProjectBySlug(slug, category)
  if (!project) {
    notFound()
  }

  return null
}