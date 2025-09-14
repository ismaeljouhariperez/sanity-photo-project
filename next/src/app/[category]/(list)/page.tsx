import { Metadata } from 'next'
import { getSiteSettings, getProjects } from '@/lib/sanity'
import { generateCategoryMetadata } from '@/lib/seo'
import { isValidCategory } from '@/lib/constants'
import { notFound } from 'next/navigation'
import CategoryClient from './CategoryClient'

interface CategoryListPageProps {
  params: Promise<{ category: string }>
}

// Category-specific default images helper
function getDefaultImageProps(category: string) {
  if (category === 'black-and-white') {
    return {
      src: 'projects-bw.jpg',
      alt: 'Projets Noir et Blanc',
      fallbackSrc: '/images/bw-cover.jpg',
    }
  } else {
    return {
      src: 'projects-color.jpg',
      alt: 'Projets Couleur',
      fallbackSrc: '/images/color-cover.jpg',
    }
  }
}

export async function generateMetadata({ params }: CategoryListPageProps): Promise<Metadata> {
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
 * Category list page - Modern Next.js 15+ approach
 * Server Component that fetches data and passes to client
 */
export default async function CategoryListPage({ params }: CategoryListPageProps) {
  const { category } = await params
  
  if (!isValidCategory(category)) {
    notFound()
  }

  // Fetch projects on server side for better performance
  try {
    const projects = await getProjects(category)
    const defaultImages = getDefaultImageProps(category)

    return (
      <CategoryClient 
        category={category}
        projects={projects}
        defaultImages={defaultImages}
      />
    )
  } catch (error) {
    console.error('Error loading projects:', error)
    // Fallback with empty projects array
    return (
      <CategoryClient 
        category={category}
        projects={[]}
        defaultImages={getDefaultImageProps(category)}
      />
    )
  }
}