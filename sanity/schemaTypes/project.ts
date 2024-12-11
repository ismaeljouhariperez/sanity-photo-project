export const project = {
  name: 'project',
  title: 'Projet',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'subtitle',
      title: 'Sous-titre',
      type: 'string'
    },
    {
      name: 'slug',
      title: 'Chemin URL',
      type: 'slug',
      options: {
        source: 'title'
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'projectType',
      title: 'Type de projet',
      type: 'string',
      options: {
        list: [
          {title: 'Noir et Blanc', value: 'bw'},
          {title: 'Couleur', value: 'color'}
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'backgroundColor',
      title: 'Couleur de fond',
      type: 'string',
      description: 'Code hexadécimal de la couleur (ex: #FFFFFF)'
    },
    {
      name: 'layout',
      title: 'Disposition',
      type: 'string',
      options: {
        list: [
          {title: 'Compact', value: 'compact'},
          {title: 'Normal', value: 'normal'},
          {title: 'Plein écran', value: 'fullscreen'}
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'image',
            title: 'Image',
            type: 'image'
          },
          {
            name: 'alt',
            title: 'Description alternative',
            type: 'string',
            description: 'Description pour l\'accessibilité'
          }
        ]
      }]
    },
    {
      name: 'order',
      title: 'Ordre d\'affichage',
      type: 'number',
      description: 'Position du projet dans la liste (1 = premier)',
    },
    {
      name: 'date',
      title: 'Date du projet',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD'
      }
    },
    {
      name: 'featured',
      title: 'Projet mis en avant',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'metadata',
      title: 'Métadonnées',
      type: 'object',
      fields: [
        {
          name: 'location',
          title: 'Lieu',
          type: 'string'
        },
        {
          name: 'client',
          title: 'Client',
          type: 'string'
        },
        {
          name: 'year',
          title: 'Année',
          type: 'number'
        }
      ]
    },
    {
      name: 'description',
      title: 'Description détaillée',
      type: 'array',
      of: [{type: 'block'}], // Permet un texte riche avec formatage
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      }
    },
    {
      name: 'nextProject',
      title: 'Projet suivant',
      type: 'reference',
      to: [{type: 'project'}],
      description: 'Lien vers le projet suivant dans la navigation'
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'images.0.image'
    }
  }
} 