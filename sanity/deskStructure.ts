import { StructureBuilder } from 'sanity/desk'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Contenu')
    .items([
      S.listItem()
        .title('Noir & Blanc')
        .child(
          S.documentList()
            .title('Noir & Blanc')
            .filter('_type == "project" && projectType == "bw"')
        ),
      S.listItem()
        .title('Couleur')
        .child(
          S.documentList()
            .title('Couleur')
            .filter('_type == "project" && projectType == "color"')
        ),
    ]) 