import { SanityImageSource } from '@sanity/image-url/lib/types/types'

export interface Post {
  _id: string
  title: string
  slug: {
    current: string
  }
  mainImage: SanityImageSource
  body: any[]
}
