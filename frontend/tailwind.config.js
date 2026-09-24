/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0a0a0a',
          lighter: '#1a1a1a',
          card: '#1e1e1e',
        },
        gold: {
          DEFAULT: '#d4af37',
          light: '#f3e5ab',
          dark: '#aa8c2c'
        },
        purple: {
          accent: '#4B0082',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
      }
    },
  },
  plugins: [],
}
