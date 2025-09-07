export const project = {
  name: 'project',
  title: 'Projets',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Contenu',
      default: true,
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    {
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      group: 'content',
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
      group: 'content',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'content',
    },
    {
      name: 'coverImage',
      title: 'Image de couverture',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
      group: 'content',
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
      group: 'content',
    },
    {
      name: 'images',
      title: 'Images du projet',
      description: 'Ajoutez des images à ce projet',
      type: 'array',
      group: 'content',
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
      group: 'content',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seoMetaFields',
      group: 'seo',
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
