import {StructureBuilder} from 'sanity/structure'
import {
  MdPhotoLibrary,
  MdPhoto,
  MdCollections,
  MdInvertColors,
  MdColorLens,
  MdSettings,
} from 'react-icons/md'

// Liste des types de documents que nous voulons cacher dans la liste par défaut
const hiddenDocTypes = (listItem: any) => !['siteSettings'].includes(listItem.getId())

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Contenu')
    .items([
      S.listItem()
        .title('Paramètres du site')
        .icon(MdSettings)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),

      S.divider(),

      S.listItem()
        .title('Collections')
        .icon(MdCollections)
        .child(S.documentTypeList('collection').title('Collections')),

      S.divider(),

      S.listItem()
        .title('Projets Photo')
        .icon(MdPhotoLibrary)
        .child(
          S.list()
            .title('Projets par catégorie')
            .items([
              S.listItem()
                .title('Noir et Blanc')
                .icon(MdInvertColors)
                .child(
                  S.documentList()
                    .title('Projets Noir et Blanc')
                    .filter('_type == "project" && category == "black-and-white"')
                    .defaultOrdering([{field: 'order', direction: 'asc'}]),
                ),
              S.listItem()
                .title('Couleur')
                .icon(MdColorLens)
                .child(
                  S.documentList()
                    .title('Projets Couleur')
                    .filter('_type == "project" && category == "early-color"')
                    .defaultOrdering([{field: 'order', direction: 'asc'}]),
                ),
              S.divider(),
              S.listItem()
                .title('Tous les projets')
                .icon(MdPhotoLibrary)
                .child(S.documentTypeList('project').title('Tous les projets')),
            ]),
        ),

      S.listItem()
        .title('Photos')
        .icon(MdPhoto)
        .child(S.documentTypeList('photo').title('Toutes les photos')),

      // Ajouter d'autres types de documents ici si nécessaire
    ])
