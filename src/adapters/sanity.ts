import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import {
  Collection,
  Photo,
  Project,
  SanityImage,
  SiteSettings,
} from '@/lib/sanity.types'

export interface ISanityService {
  fetchProjects(category?: string): Promise<Project[]>
  fetchProjectBySlug(slug: string, category: string): Promise<Project>
  fetchPhotos(projectId: string): Promise<Photo[]>
  fetchSiteSettings(): Promise<SiteSettings>
  fetchCollections(active?: boolean): Promise<Collection[]>
  urlFor(
    source: SanityImage
  ): ReturnType<typeof imageUrlBuilder.prototype.image>
}

export class SanityAdapter implements ISanityService {
  private client
  private builder

  constructor() {
    this.client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5ynkrt2t',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2023-05-03',
      useCdn: process.env.NODE_ENV === 'production',
    })

    this.builder = imageUrlBuilder(this.client)
  }

  urlFor(source: SanityImage) {
    return this.builder.image(source as SanityImageSource)
  }

  async fetchProjects(category?: string): Promise<Project[]> {
    const query = `*[_type == "project"${
      category ? ` && category == "${category}"` : ''
    }] | order(order asc) {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      title,
      "slug": slug.current,
      description,
      category,
      "coverImage": coverImage,
      order
    }`

    return this.client.fetch(query)
  }

  async fetchProjectBySlug(slug: string, category: string): Promise<Project> {
    const query = `*[_type == "project" && slug.current == $slug && category == $category][0] {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      title,
      slug,
      description,
      category,
      coverImage,
      order,
      "photos": photos[]->{ 
        _id, 
        _type,
        _createdAt,
        _updatedAt,
        title, 
        image,
        alt,
        description,
        order,
        tags,
        "url": image.asset->url,
        "dimensions": image.asset->metadata.dimensions
      }
    }`

    return this.client.fetch(query, { slug, category })
  }

  async fetchPhotos(projectId: string): Promise<Photo[]> {
    const query = `*[_type == "project" && _id == $projectId][0] {
      "photos": photos[]->{ 
        _id, 
        _type,
        _createdAt,
        _updatedAt,
        title, 
        image,
        alt,
        description,
        order,
        tags,
        "url": image.asset->url,
        "dimensions": image.asset->metadata.dimensions
      }
    }`

    return this.client
      .fetch(query, { projectId })
      .then((result: { photos?: Photo[] }) => result?.photos || [])
  }

  async fetchSiteSettings(): Promise<SiteSettings> {
    const query = `*[_type == "siteSettings"][0]`
    return this.client.fetch(query)
  }

  async fetchCollections(active?: boolean): Promise<Collection[]> {
    const query = `*[_type == "collection"${
      active ? ' && active == true' : ''
    }] | order(order asc) {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      title,
      slug,
      description,
      coverImage,
      order,
      active,
      "projects": projects[]->{ 
        _id, 
        _type,
        title,
        slug,
        category,
        coverImage,
        order
      }
    }`

    return this.client.fetch(query)
  }
}
