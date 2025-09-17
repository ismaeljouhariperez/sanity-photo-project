import { Metadata } from 'next'
import { getProjectBySlug, urlFor } from '@/lib/sanity'
import { generateCategoryMetadata, generateProjectMetadata } from '@/lib/seo'
import { isValidCategory } from '@/lib/constants'
import { notFound } from 'next/navigation'
import ProjectSlider from '@/components/ui/media/ProjectSlider'

interface ProjectPageProps {
  params: Promise<{ category: string; slug: string }>
}

// Removed getCachedSettings - SEO now handled in Next.js for better performance

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
    const project = await getProjectBySlug(slug, category).catch(() => null)
    
    if (project) {
      return generateProjectMetadata({
        title: project.title,
        description: project.description,
        category: project.category,
        slug: project.slug?.current,
        coverImage: project.coverImage ? urlFor(project.coverImage).width(1200).height(630).url() : undefined
      })
    }

    return generateCategoryMetadata(category)
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