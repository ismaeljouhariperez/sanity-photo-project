import { getProjects } from '@/lib/sanity'

interface Project {
  _id: string
  title: string
  slug: { current: string } | string
  images?: Array<{ _key: string; asset: { _ref: string } }>
}

export interface MenuData {
  blackAndWhiteProjects: Project[]
  earlyColorProjects: Project[]
}

export async function getMenuData(): Promise<MenuData> {
  const [blackAndWhiteProjects, earlyColorProjects] = await Promise.all([
    getProjects('black-and-white'),
    getProjects('early-color')
  ])

  return {
    blackAndWhiteProjects,
    earlyColorProjects
  }
}