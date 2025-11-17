/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nexus': {
          'primary': '#9333ea',
          'secondary': '#ec4899',
          'dark': '#0f172a',
          'darker': '#020617',
        }
      }
    },
  },
  plugins: [],
}
