/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./sanity/components/**/*.{ts,tsx}",
    "./sanity/schemas/**/*.{ts,tsx}",
    "./sanity/*.{ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

