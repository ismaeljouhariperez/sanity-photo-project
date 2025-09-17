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
    // Removed 'author' field - hardcoded as 'Ismael Perez León' in frontend
    // Removed 'logo' field - not used in minimal photography design
    // Removed 'socialLinks' field - social links not implemented in current design
    // Removed 'mainNavigation' field - navigation is hardcoded in header component
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
    // Removed 'themeColors' field - theme colors defined in Tailwind CSS
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
