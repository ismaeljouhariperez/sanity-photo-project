declare module 'next-sanity' {
  import { SanityClient } from '@sanity/client'

  export function createClient(config: {
    projectId: string
    dataset: string
    apiVersion: string
    useCdn?: boolean
    token?: string
  }): SanityClient

  export interface SanityClient {
    fetch<T>(query: string, params?: Record<string, any>): Promise<T>
  }
}

declare module '@sanity/image-url/lib/types/types' {
  export interface SanityImageSource {
    _type: string
    asset: {
      _ref: string
      _type: string
    }
    [key: string]: any
  }
}
