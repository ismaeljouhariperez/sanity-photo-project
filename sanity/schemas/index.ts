import { SchemaTypeDefinition } from 'sanity'
import photo from './photo'
import collection from './collection'
import { project } from './project'

export const schemaTypes: SchemaTypeDefinition[] = [
  photo,
  collection,
  project,
]
