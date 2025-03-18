import { useRouter } from 'next/router'

// Interface de navigation
export interface INavigationService {
  navigateTo(path: string): Promise<void>
}

// Adapter pour Next.js Router
export class NextNavigationAdapter implements INavigationService {
  constructor(private router: ReturnType<typeof useRouter>) {}
  async navigateTo(path: string): Promise<void> {
    await this.router.push(path)
  }
}
