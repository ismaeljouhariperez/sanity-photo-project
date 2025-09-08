export const siteSettings = {
  name: 'siteSettings',
  title: 'Configuration du site',
  type: 'document',
  __experimental_actions: [
    // Disable create/delete for singleton
    'update',
    'publish'
  ],
  fields: [
    {
      name: 'title',
      title: 'Titre du site',
      type: 'string',
      description: 'Titre principal du site',
    },
    {
      name: 'description',
      title: 'Description du site',
      type: 'text',
      description: 'Description générale du site',
    },
    {
      name: 'seo',
      title: 'SEO Global',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Titre SEO par défaut',
          type: 'string',
          description: 'Titre pour les moteurs de recherche (50-60 caractères)',
          validation: (Rule: any) => Rule.max(60),
        },
        {
          name: 'metaDescription',
          title: 'Description SEO par défaut',
          type: 'text',
          description: 'Description pour les moteurs de recherche (150-160 caractères)',
          validation: (Rule: any) => Rule.max(160),
        },
        {
          name: 'ogImage',
          title: 'Image Open Graph par défaut',
          type: 'image',
          description: 'Image par défaut pour les réseaux sociaux (1200x630px)',
        },
        {
          name: 'keywords',
          title: 'Mots-clés par défaut',
          type: 'array',
          of: [{type: 'string'}],
          description: 'Mots-clés généraux pour le site',
        },
        {
          name: 'author',
          title: 'Auteur',
          type: 'string',
          description: 'Nom de l\'auteur/photographe',
        },
        {
          name: 'siteUrl',
          title: 'URL du site',
          type: 'url',
          description: 'URL principale du site (avec https://)',
        },
      ],
    },
    {
      name: 'social',
      title: 'Réseaux sociaux',
      type: 'object',
      fields: [
        {
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
        },
        {
          name: 'twitter',
          title: 'Twitter/X',
          type: 'url',
        },
        {
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Configuration du site',
      };
    },
  },
};