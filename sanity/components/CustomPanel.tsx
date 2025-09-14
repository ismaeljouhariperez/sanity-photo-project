import {Card, Stack, Text, Box} from '@sanity/ui'
import s from './CustomPanel.module.css'

export function CustomPanel() {
  return (
    <Card padding={4} className={`${s.customPanel} bg-gray-50`}>
      <Box className={`${s.container} max-w-4xl mx-auto`}>
        <Stack space={4}>
          <Text size={2} weight="bold" className={`${s.title} text-2xl text-blue-600`}>
            Mon Dashboard Personnalisé
          </Text>
          <Text className={`${s.content} text-gray-700 hover:text-gray-900`}>
            Bienvenue dans votre panel personnalisé.
          </Text>
        </Stack>
      </Box>
    </Card>
  )
}
