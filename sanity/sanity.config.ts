import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {structure} from './deskStructure'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'analog_project',

  projectId: '5ynkrt2t',
  dataset: 'production',

  plugins: [
    deskTool({
      structure
    })
  ],

  schema: {
    types: schemaTypes,
  },
})
