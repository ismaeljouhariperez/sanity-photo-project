export interface Project {
  id: string
  slug: string
  title: string
  description: string
  coverImage: string
  images: string[]
  date: string
  category: 'black-and-white' | 'early-color'
}

export const projects: Project[] = [
  {
    id: '1',
    slug: 'les-jardins',
    title: 'Les jardins',
    description: 'Description du projet...',
    coverImage: '/images/projet-1/cover.jpg',
    images: [
      '/images/projet-1/1.jpg',
      '/images/projet-1/2.jpg',
      // ...
    ],
    date: '2024',
    category: 'black-and-white',
  },
]
