export default {
  name: 'photo',
  title: 'Photo',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
        metadata: ['exif', 'location', 'palette'],
        storeOriginalFilename: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: "Important pour l'accessibilité et le SEO",
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
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'order',
      title: "Ordre d'affichage",
      type: 'number',
      description: "Ordre d'affichage dans un projet",
      initialValue: 0,
    },
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
    },
  },
}
