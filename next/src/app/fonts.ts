import localFont from 'next/font/local'
import { Inter } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const aujournuit = localFont({
  src: [
    {
      path: '../../public/fonts/Aujournuit-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Aujournuit-Airy.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Aujournuit-Condensed.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Aujournuit-Densed.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Aujournuit-Wide.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  display: 'swap',
})
