import { useRouter } from 'next/navigation'

// Interface de navigation
export interface INavigationService {
  navigateTo(path: string): Promise<void>
}

// Adapter pour Next.js Router
export class NextNavigationAdapter implements INavigationService {
  constructor(private router: ReturnType<typeof useRouter>) {}

  async navigateTo(path: string): Promise<void> {
    // Utilisation directe sans await pour éviter l'erreur
    // "A listener indicated an asynchronous response by returning true, but the message channel closed"
    this.router.push(path)
  }
}
