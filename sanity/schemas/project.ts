export const project = {
  name: 'project',
  title: 'Projets',
  type: 'document',
  // Removed groups - simplified schema without SEO tab
  fields: [
    {
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'coverImage',
      title: 'Image de couverture',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          {title: 'Noir et Blanc', value: 'black-and-white'},
          {title: 'Couleur', value: 'early-color'},
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'images',
      title: 'Images du projet',
      description: 'Ajoutez des images à ce projet',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
                metadata: ['lqip', 'dimensions', 'palette'], // Extract useful metadata
              },
              validation: (Rule: any) => Rule.required().custom(async (image: any, context: any) => {
                if (!image?.asset) return 'Image required'
                
                // Get image dimensions for photography validation
                const asset = await context.getClient({}).fetch(
                  '*[_id == $assetId][0].metadata.dimensions',
                  { assetId: image.asset._ref }
                )
                
                if (asset && (asset.width < 1200 || asset.height < 800)) {
                  return 'Image too small for photography portfolio (minimum 1200x800px)'
                }
                
                return true
              }),
            },
            {
              name: 'title',
              title: 'Titre',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            },
            {
              name: 'altDescription',
              title: 'Description alternative (accessibilité)',
              type: 'string',
              description: 'Description précise pour les lecteurs d’écran et l’accessibilité',
              validation: (Rule: any) => Rule.required().min(10).max(200),
            },
          ],
          preview: {
            select: {
              title: 'title',
              media: 'image',
            },
            prepare({title, media}: {title?: string; media?: any}) {
              return {
                title: title || 'Image sans titre',
                media,
              }
            },
          },
        },
      ],
    },
    // Removed 'order' field - using _createdAt for chronological ordering
    // Removed 'seo' field - SEO handled in Next.js for better performance
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      category: 'category',
    },
    prepare({title, media, category}: {title?: string; media?: any; category?: string}) {
      return {
        title,
        subtitle: category === 'black-and-white' ? 'Noir et Blanc' : 'Couleur',
        media,
      }
    },
  },
}
