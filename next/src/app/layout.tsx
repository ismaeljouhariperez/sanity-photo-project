import { Metadata } from 'next'
import { getSiteSettings } from '@/lib/sanity'
import { generateHomeMetadata } from '@/lib/seo'
import ClientLayout from '@/components/layout/ClientLayout'
import './globals.css'
import { aujournuit } from './fonts'

// Generate metadata for the site
export async function generateMetadata(): Promise<Metadata> {
  try {
    const siteSettings = await getSiteSettings()
    return generateHomeMetadata(siteSettings)
  } catch (error) {
    console.error('Error generating metadata:', error)
    return generateHomeMetadata() // Fallback to defaults
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={aujournuit.className} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="bg-cream pt-header" suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
