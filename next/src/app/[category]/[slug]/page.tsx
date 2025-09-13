import { Metadata } from 'next'
import { getSiteSettings } from '@/lib/sanity'
import { generateCategoryMetadata } from '@/lib/seo'
import { isValidCategory } from '@/lib/constants'
import { notFound } from 'next/navigation'

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

/**
 * Project detail page
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { category, slug } = await params
  
  if (!isValidCategory(category)) {
    notFound()
  }

  // Import dynamically to avoid SSR issues
  const ProjectPhotosGrid = (await import('@/components/ui/ProjectPhotosGrid')).default

  return (
    <ProjectPhotosGrid 
      projectSlug={slug}
      category={category}
    />
  )
}