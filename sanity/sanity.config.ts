import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'
import {structure} from './deskStructure'
import {CustomPanel} from './components/CustomPanel'
import './styles/styles.css'
import {media} from 'sanity-plugin-media'

export default defineConfig({
  name: 'default',
  title: 'analog_project',

  projectId: '5ynkrt2t',
  dataset: 'production',

  plugins: [
    structureTool({
      structure,
    }),
    media(),
  ],

  schema: {
    types: schemaTypes,
  },
  theme: {
    '--my-black': '#1a1a1a',
    '--my-white': '#fff',
    '--font-family-base': '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    '--card-fg-color': 'var(--my-black)',
    '--card-bg-color': 'var(--my-white)',
  },
})
