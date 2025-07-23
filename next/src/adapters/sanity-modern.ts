import { 
  getProjects, 
  getProjectBySlug, 
  getSiteSettings, 
  getCollections 
} from '@/lib/sanity'
import type {
  Project,
  Photo,
  SiteSettings,
  Collection,
} from '@/lib/sanity.types'

// Extended Project interface with photos
interface ProjectFull extends Project {
  photos?: Photo[]
}

export interface ISanityService {
  fetchProjects(category?: string): Promise<Project[]>
  fetchProjectBySlug(slug: string, category: string): Promise<ProjectFull>
  fetchSiteSettings(): Promise<SiteSettings>
  fetchCollections(): Promise<Collection[]>
}

export class SanityAdapter implements ISanityService {
  async fetchProjects(category?: string): Promise<Project[]> {
    try {
      return await getProjects(category)
    } catch (error) {
      console.error('Error fetching projects:', error)
      return []
    }
  }

  async fetchProjectBySlug(slug: string, category: string): Promise<ProjectFull> {
    try {
      const project = await getProjectBySlug(slug, category)
      if (!project) {
        throw new Error(`Project not found: ${slug}`)
      }
      return project
    } catch (error) {
      console.error('Error fetching project by slug:', error)
      throw error
    }
  }

  async fetchSiteSettings(): Promise<SiteSettings> {
    try {
      return await getSiteSettings()
    } catch (error) {
      console.error('Error fetching site settings:', error)
      throw error
    }
  }

  async fetchCollections(): Promise<Collection[]> {
    try {
      return await getCollections()
    } catch (error) {
      console.error('Error fetching collections:', error)
      return []
    }
  }
}

// Export singleton instance
export const sanityAdapter = new SanityAdapter()