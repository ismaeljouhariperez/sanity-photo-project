import { useRouter } from 'next/navigation'
import { NextNavigationAdapter, SanityAdapter } from '@/adapters'
import { useMemo } from 'react'

export function useServices() {
  const router = useRouter()

  return useMemo(
    () => ({
      navigation: new NextNavigationAdapter(router),
      sanity: new SanityAdapter(),
    }),
    [router]
  )
}
