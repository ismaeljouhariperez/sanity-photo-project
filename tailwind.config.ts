import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
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
    },
  },
  darkMode: 'class',
  plugins: [],
}

export default config
