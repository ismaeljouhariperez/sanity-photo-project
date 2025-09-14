import { Metadata } from 'next'
import { getSiteSettings, getProjectBySlug } from '@/lib/sanity'
import { generateCategoryMetadata } from '@/lib/seo'
import { isValidCategory } from '@/lib/constants'
import { notFound } from 'next/navigation'
import ProjectSlider from '@/components/ui/ProjectSlider'

interface ProjectPageProps {
  params: Promise<{ category: string; slug: string }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  try {
    const { category } = await params
    
    if (!isValidCategory(category)) {
      return {
        title: 'Page non trouvée',
        description: 'La page demandée n\'existe pas.',
      }
    }

    const siteSettings = await getSiteSettings()
    return generateCategoryMetadata(category, siteSettings)
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