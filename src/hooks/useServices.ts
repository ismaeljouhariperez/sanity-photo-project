import { useRouter } from 'next/navigation'
import { NextNavigationAdapter, SanityAdapter } from '@/adapters'

export function useServices() {
  const router = useRouter()

  return {
    navigation: new NextNavigationAdapter(router),
    sanity: new SanityAdapter(),
  }
}
