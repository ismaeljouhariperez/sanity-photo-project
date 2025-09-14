import { Metadata } from 'next'
import { getSiteSettings, getProjectBySlug } from '@/lib/sanity'
import { generateCategoryMetadata } from '@/lib/seo'
import { isValidCategory } from '@/lib/constants'
import { notFound } from 'next/navigation'
import ProjectSlider from '@/components/ui/media/ProjectSlider'
import { cache } from 'react'

interface ProjectPageProps {
  params: Promise<{ category: string; slug: string }>
}

// Cached site settings to avoid duplicate requests (React cache deduplicates automatically)
const getCachedSettings = cache(async () => {
  return await getSiteSettings()
})

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  try {
    const { category, slug } = await params
    
    if (!isValidCategory(category)) {
      return {
        title: 'Page non trouvée',
        description: 'La page demandée n\'existe pas.',
      }
    }

    // Use cached settings to avoid duplicate requests
    const [siteSettings, project] = await Promise.all([
      getCachedSettings(),
      getProjectBySlug(slug, category).catch(() => null)
    ])

    // Enhanced metadata with project-specific information
    const baseMetadata = generateCategoryMetadata(category, siteSettings)
    
    if (project) {
      return {
        ...baseMetadata,
        title: `${project.title} | ${baseMetadata.title}`,
        description: project.description || baseMetadata.description,
      }
    }

    return baseMetadata
  } catch (error) {
    console.error('Error generating metadata:', error)
    return generateCategoryMetadata('black-and-white')
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { category, slug } = await params
  
  if (!isValidCategory(category)) {
    notFound()
  }

  const project = await getProjectBySlug(slug, category)
  
  if (!project) {
    notFound()
  }

  return <ProjectSlider project={project} />
}