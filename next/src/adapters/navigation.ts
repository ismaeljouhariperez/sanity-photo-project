import { useRouter } from 'next/navigation'

// Interface de navigation
export interface INavigationService {
  navigateTo(path: string): void
}

/**
 * Adapter for Next.js Router
 * Provides a consistent navigation interface across the application
 */
export class NextNavigationAdapter implements INavigationService {
  constructor(private router: ReturnType<typeof useRouter>) {}

  navigateTo(path: string): void {
    // Direct usage of router.push as it's already handling navigation internally
    this.router.push(path)
  }
}
