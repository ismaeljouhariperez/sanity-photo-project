import {SchemaTypeDefinition} from 'sanity'
import photo from './photo'
import collection from './collection'
import {project} from './project'
import siteSettings from './siteSettings'
import blockContent from './portableText'

export const schemaTypes: SchemaTypeDefinition[] = [photo, collection, project, siteSettings, blockContent]
