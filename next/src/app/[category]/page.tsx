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
    console.error('Error generating category metadata:', error)
    return generateCategoryMetadata('black-and-white') // Fallback
  }
}

/**
 * Category list page
 * The actual project list is rendered by the layout component
 * This page intentionally returns null since layout handles the display
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  
  if (!isValidCategory(category)) {
    notFound()
  }

  return null
}