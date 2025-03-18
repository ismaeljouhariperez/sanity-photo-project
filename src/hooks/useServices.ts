import { useRouter } from 'next/navigation'
import { useAnimationStore } from '@/store/animationStore'
import {
  NextNavigationAdapter,
  ZustandAnimationAdapter,
  SanityAdapter,
} from '@/adapters'

export function useServices() {
  const router = useRouter()
  const animationStore = useAnimationStore()

  return {
    navigation: new NextNavigationAdapter(router),
    animation: new ZustandAnimationAdapter(animationStore),
    sanity: new SanityAdapter(),
  }
}
