import { MetadataRoute } from 'next'
import { getProjects } from '@/lib/sanity'
import type { Project } from '@/lib/sanity.types'
import { CATEGORIES } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ismaelperezleon.com'

  // Get all projects for dynamic routes
  const monochromeProjects = await getProjects(CATEGORIES.MONOCHROME)
  const earlyColorProjects = await getProjects(CATEGORIES.EARLY_COLOR)

  const projectUrls = [
    ...monochromeProjects.map((project: Project) => ({
      url: `${baseUrl}/${CATEGORIES.MONOCHROME}/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...earlyColorProjects.map((project: Project) => ({
      url: `${baseUrl}/${CATEGORIES.EARLY_COLOR}/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/${CATEGORIES.MONOCHROME}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${CATEGORIES.EARLY_COLOR}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...projectUrls,
  ]
}