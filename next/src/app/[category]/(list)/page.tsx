import { Metadata } from 'next'
import { getProjects } from '@/lib/sanity'
import { generateCategoryMetadata } from '@/lib/seo'
import { isValidCategory, CATEGORIES } from '@/lib/constants'
import { notFound } from 'next/navigation'
import CategoryClient from './CategoryClient'

interface CategoryListPageProps {
  params: Promise<{ category: string }>
}

// Category-specific default images helper
function getDefaultImageProps(category: string) {
  if (category === CATEGORIES.MONOCHROME) {
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

// Removed getCachedSettings - SEO now handled in Next.js for better performance

// ISR: Revalidate category pages every 2 hours (less frequent than individual projects)
export const revalidate = 7200

export async function generateMetadata({ params }: CategoryListPageProps): Promise<Metadata> {
  try {
    const { category } = await params
    
    if (!isValidCategory(category)) {
      return {
        title: 'Page non trouvée',
        description: 'La page demandée n\'existe pas.',
      }
    }

    return generateCategoryMetadata(category)
  } catch (error) {
    console.error('Error generating metadata:', error)
    return generateCategoryMetadata(CATEGORIES.MONOCHROME)
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

  // Fetch projects on server side for better performance with caching
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