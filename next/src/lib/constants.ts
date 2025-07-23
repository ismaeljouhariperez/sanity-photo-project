export const VALID_CATEGORIES = ['black-and-white', 'early-color'] as const

export type CategoryType = typeof VALID_CATEGORIES[number]

export function isValidCategory(category: string): category is CategoryType {
  return VALID_CATEGORIES.includes(category as CategoryType)
}