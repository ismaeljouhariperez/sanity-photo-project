import { getProjects } from '@/lib/sanity'
import { CATEGORIES } from '@/lib/constants'
import type { Project } from '@/lib/sanity.types'

export interface MenuData {
  monochromeProjects: Project[]
  earlyColorProjects: Project[]
}

export async function getMenuData(): Promise<MenuData> {
  const [monochromeProjects, earlyColorProjects] = await Promise.all([
    getProjects(CATEGORIES.MONOCHROME),
    getProjects(CATEGORIES.EARLY_COLOR)
  ])

  return {
    monochromeProjects,
    earlyColorProjects
  }
}