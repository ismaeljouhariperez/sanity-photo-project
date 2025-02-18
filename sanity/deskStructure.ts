import {StructureBuilder} from 'sanity/structure'
import {CustomPanel} from './components/CustomPanel'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Contenu')
    .items([
      S.listItem().title('Dashboard').child(S.component(CustomPanel).title('Mon Dashboard')),
      S.listItem()
        .title('Black & White')
        .child(
          S.documentList()
            .title('Black & White')
            .filter('_type == "project" && projectType == "bw"'),
        ),
      S.listItem()
        .title('Early Color')
        .child(
          S.documentList()
            .title('Early Color')
            .filter('_type == "project" && projectType == "color"'),
        ),
    ])
