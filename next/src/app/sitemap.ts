import { MetadataRoute } from 'next'
import { getProjects } from '@/lib/sanity'
import type { Project } from '@/lib/sanity.types'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ismaelperezleon.com'

  // Get all projects for dynamic routes
  const blackAndWhiteProjects = await getProjects('black-and-white')
  const earlyColorProjects = await getProjects('early-color')

  const projectUrls = [
    ...blackAndWhiteProjects.map((project: Project) => ({
      url: `${baseUrl}/black-and-white/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...earlyColorProjects.map((project: Project) => ({
      url: `${baseUrl}/early-color/${project.slug}`,
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
      url: `${baseUrl}/black-and-white`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/early-color`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...projectUrls,
  ]
}