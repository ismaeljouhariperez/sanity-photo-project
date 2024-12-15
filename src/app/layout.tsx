import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import { MenuProvider } from './context/MenuContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ismael Ahab',
  description: 'Portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <MenuProvider>
          <Header />
          <main className="h-full">
            {children}
          </main>
        </MenuProvider>
      </body>
    </html>
  )
}