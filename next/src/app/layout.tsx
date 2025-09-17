import { Metadata } from 'next'
import { generateHomeMetadata } from '@/lib/seo'
import { getMenuData } from '@/components/ui/MenuOverlay/MenuData'
import ClientLayout from '@/components/layout/ClientLayout'
import './globals.css'
import { aujournuit } from './fonts'

// Generate metadata for the site - now hardcoded for optimal performance
export async function generateMetadata(): Promise<Metadata> {
  return generateHomeMetadata()
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch menu data once at the server level
  let menuData = null
  try {
    menuData = await getMenuData()
  } catch (error) {
    console.error('Failed to fetch menu data:', error)
    // Continue with null data - MenuOverlay can handle this gracefully
  }

  return (
    <html lang="fr" className={aujournuit.className} suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#faf9f6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-cream lg:pt-header" suppressHydrationWarning>
        <ClientLayout menuData={menuData}>{children}</ClientLayout>
      </body>
    </html>
  )
}
