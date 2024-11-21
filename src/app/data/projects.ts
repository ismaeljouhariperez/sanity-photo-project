export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  images: string[];
  date: string;
}

export const projects: Project[] = [
  {
    id: '1',
    slug: 'projet-1',
    title: 'Nom du Projet 1',
    description: 'Description du projet...',
    coverImage: '/images/projet-1/cover.jpg',
    images: [
      '/images/projet-1/1.jpg',
      '/images/projet-1/2.jpg',
      // ...
    ],
    date: '2024'
  },
];
