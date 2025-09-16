import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // Mobile-first responsive breakpoints
    screens: {
      'xs': '375px',   // Small mobile devices
      'sm': '640px',   // Large mobile devices  
      'md': '768px',   // Tablets
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Large desktop
      '2xl': '1536px', // Extra large desktop
    },
    extend: {
      fontFamily: {
        aujournuit: ['var(--font-aujournuit)'],
      },
      fontWeight: {
        airy: '200',
        condensed: '300',
        normal: '400',
        densed: '500',
        wide: '600',
      },
      // Mobile-optimized spacing scale
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      // Enhanced safe area support for iOS devices
      padding: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      margin: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      // Touch-friendly minimum sizes
      minHeight: {
        'touch': '44px', // iOS/Android minimum touch target
        'screen-safe': '100dvh', // Dynamic viewport height
      },
      minWidth: {
        'touch': '44px',
      },
      // Mobile-optimized typography
      fontSize: {
        'xs-mobile': ['0.75rem', { lineHeight: '1.2' }],
        'sm-mobile': ['0.875rem', { lineHeight: '1.3' }],
        'base-mobile': ['1rem', { lineHeight: '1.4' }],
        'lg-mobile': ['1.125rem', { lineHeight: '1.4' }],
        'xl-mobile': ['1.25rem', { lineHeight: '1.3' }],
      },
    },
  },
  plugins: [],
}

export default config
