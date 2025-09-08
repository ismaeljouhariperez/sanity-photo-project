export default {
  name: 'siteSettings',
  title: 'Paramètres du site',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre du site',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Description utilisée pour le SEO',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'keywords',
      title: 'Mots-clés',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'author',
      title: 'Auteur',
      type: 'string',
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'socialLinks',
      title: 'Réseaux sociaux',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Plateforme',
              type: 'string',
              options: {
                list: [
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'Twitter', value: 'twitter'},
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'Behance', value: 'behance'},
                  {title: 'Autre', value: 'other'},
                ],
              },
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule: any) =>
                Rule.uri({
                  scheme: ['http', 'https'],
                }),
            },
            {
              name: 'label',
              title: 'Label',
              type: 'string',
            },
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url',
            },
          },
        },
      ],
    },
    {
      name: 'mainNavigation',
      title: 'Navigation principale',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Texte du lien',
              type: 'string',
            },
            {
              name: 'url',
              title: 'URL',
              type: 'string',
              description: 'Chemin relatif (ex: /about)',
            },
          ],
          preview: {
            select: {
              title: 'text',
              subtitle: 'url',
            },
          },
        },
      ],
    },
    {
      name: 'seo',
      title: 'SEO Global',
      type: 'seoMetaFields',
    },
    {
      name: 'siteUrl',
      title: 'URL du site',
      type: 'url',
      description: 'URL principale du site (ex: https://monsite.com)',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'themeColors',
      title: 'Couleurs du thème',
      type: 'object',
      fields: [
        {
          name: 'primaryColor',
          title: 'Couleur principale',
          type: 'color',
          options: {
            disableAlpha: true,
          },
        },
        {
          name: 'secondaryColor',
          title: 'Couleur secondaire', 
          type: 'color',
          options: {
            disableAlpha: true,
          },
        },
        {
          name: 'backgroundColor',
          title: 'Couleur de fond',
          type: 'color',
          options: {
            disableAlpha: true,
          },
        },
        {
          name: 'textColor',
          title: 'Couleur du texte',
          type: 'color',
          options: {
            disableAlpha: true,
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}: {title: string}) {
      return {
        title: `Paramètres du site: ${title}`,
      }
    },
  },
}
