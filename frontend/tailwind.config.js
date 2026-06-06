/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A5F',
          dark: '#0F2440',
          light: '#2B4A7A',
        },
        secondary: {
          DEFAULT: '#D4AF37',
          dark: '#B8960F',
          light: '#E2C265',
        },
        accent: {
          success: '#2E7D32',
          danger: '#C62828',
          warning: '#ED6C02',
          info: '#0288D1',
        },
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        openSans: ['Open Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        'soft-lg': '0 20px 30px -10px rgba(0, 0, 0, 0.15)',
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
    },
  },
  plugins: [],
}
