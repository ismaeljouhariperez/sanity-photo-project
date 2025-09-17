export default {
  name: 'photo',
  title: 'Photo',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
        metadata: ['lqip', 'dimensions', 'palette'], // Optimized metadata for web
        storeOriginalFilename: true,
      },
      validation: (Rule: any) => Rule.required().custom(async (image: any, context: any) => {
        if (!image?.asset) return 'Image required'
        
        // Photography portfolio validation
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
      name: 'altDescription',
      title: 'Description alternative (accessibilité)',
      type: 'string',
      description: 'Description précise pour les lecteurs d’écran et l’accessibilité',
      validation: (Rule: any) => Rule.required().min(10).max(200),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'project',
      title: 'Projet associé',
      type: 'reference',
      to: [{type: 'project'}],
      description: 'Projet auquel cette photo appartient',
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    },
    // Removed 'order' field - using array position for ordering
    {
      name: 'featured',
      title: 'Photo mise en avant',
      type: 'boolean',
      description: 'Marquer cette photo comme importante',
      initialValue: false,
    },
    {
      name: 'shotDate',
      title: 'Date de prise de vue',
      type: 'date',
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      subtitle: 'description',
      project: 'project.title',
    },
    prepare({
      title,
      media,
      subtitle,
      project,
    }: {
      title: string
      media: any
      subtitle?: string
      project?: string
    }) {
      return {
        title,
        subtitle: project ? `${project} - ${subtitle || ''}` : subtitle,
        media,
      }
    },
  },
}
