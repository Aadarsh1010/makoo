/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B2A5E',
          dark: '#0F1520',
          card: '#1A2240',
          light: '#2A3F7E',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8C96A',
          dark: '#A07830',
        },
        cream: {
          DEFAULT: '#F9F3E8',
          warm: '#FEFCF8',
        },
        muted: '#9B9BA0',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        serif: ['Libre Baskerville', 'serif'],
        sans: ['Jost', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

