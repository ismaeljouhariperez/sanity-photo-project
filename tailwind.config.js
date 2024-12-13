/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./sanity/**/*.{js,ts,jsx,tsx}",
    "./sanity/components/**/*.{js,ts,jsx,tsx}",
    "./sanity/schemas/**/*.{js,ts,jsx,tsx}",
    "./sanity/*.{js,ts,jsx,tsx}",
    "./sanity/styles/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

