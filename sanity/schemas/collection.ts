export default {
  name: 'collection',
  title: 'Collection',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'projects',
      title: 'Projets',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'project'}],
        },
      ],
      description: 'Sélectionnez les projets à inclure dans cette collection',
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Ordre dans lequel cette collection apparaît',
      initialValue: 0,
    },
    {
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Cette collection est-elle visible sur le site ?',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
    },
  },
}
