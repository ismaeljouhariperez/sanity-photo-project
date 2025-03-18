export const project = {
  name: 'project',
  title: 'Projets',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre',
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
    },
    {
      name: 'coverImage',
      title: 'Image de couverture',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
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
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'photo'}],
        },
      ],
    },
    {
      name: 'order',
      title: "Ordre d'affichage",
      type: 'number',
      description: 'Ordre dans lequel ce projet apparaît dans sa catégorie',
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      category: 'category',
    },
    prepare({title, media, category}) {
      return {
        title,
        subtitle: category === 'black-and-white' ? 'Noir et Blanc' : 'Couleur',
        media,
      }
    },
  },
}
