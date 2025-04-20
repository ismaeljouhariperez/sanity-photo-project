export const project = {
  name: 'project',
  title: 'Projets',
  type: 'document',
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
              },
              validation: (Rule: any) => Rule.required(),
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
              name: 'order',
              title: "Ordre d'affichage",
              type: 'number',
              initialValue: 0,
            },
          ],
          preview: {
            select: {
              title: 'title',
              media: 'image',
            },
            prepare({title, media}) {
              return {
                title: title || 'Image sans titre',
                media,
              }
            },
          },
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
