import { Metadata } from 'next'
import { getSiteSettings } from '@/lib/sanity'
import { generateCategoryMetadata } from '@/lib/seo'
import { isValidCategory } from '@/lib/constants'
import { notFound } from 'next/navigation'

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
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
 * Category page that handles both list and detail views
 * The layout component manages all the UI and transitions
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  
  if (!isValidCategory(category)) {
    notFound()
  }

  // Layout handles all the rendering logic
  return null
}