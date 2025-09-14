import { create } from 'zustand'
import type { MenuData } from '@/components/ui/MenuOverlay/MenuData'

interface MenuStore {
  data: MenuData | null
  setMenuData: (data: MenuData) => void
  clearMenuData: () => void
}

/**
 * Store for managing menu data
 * Data is fetched once server-side and shared across client components
 * Eliminates useEffect data fetching anti-patterns
 */
export const useMenuStore = create<MenuStore>((set) => ({
  data: null,
  
  setMenuData: (data) => set({ data }),
  
  clearMenuData: () => set({ data: null }),
}))