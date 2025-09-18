// Centralized category configuration
export const CATEGORIES = {
  MONOCHROME: 'monochrome',
  EARLY_COLOR: 'early-color',
} as const

export const CATEGORY_LABELS = {
  [CATEGORIES.MONOCHROME]: 'Monochrome',
  [CATEGORIES.EARLY_COLOR]: 'Early Color',
} as const

export const CATEGORY_FRENCH_LABELS = {
  [CATEGORIES.MONOCHROME]: 'Noir et Blanc',
  [CATEGORIES.EARLY_COLOR]: 'Premières couleurs',
} as const

export const VALID_CATEGORIES = [
  CATEGORIES.MONOCHROME,
  CATEGORIES.EARLY_COLOR,
] as const

export type CategoryType = (typeof VALID_CATEGORIES)[number]

export function isValidCategory(category: string): category is CategoryType {
  return VALID_CATEGORIES.includes(category as CategoryType)
}

export function getCategoryLabel(category: CategoryType): string {
  return CATEGORY_LABELS[category]
}

export function getCategoryFrenchLabel(category: CategoryType): string {
  return CATEGORY_FRENCH_LABELS[category]
}
