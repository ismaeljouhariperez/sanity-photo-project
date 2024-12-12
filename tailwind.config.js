/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./sanity/**/*.{js,ts,jsx,tsx,mdx}",
    "./sanity/*.{js,ts,jsx,tsx,mdx}",
    "./sanity/sanity.config.ts",
    "./sanity/sanity.cli.ts",

  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

