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
          DEFAULT: '#0B5FFF',
          dark: '#0848CC',
          light: '#3B7DFF',
        },
        background: {
          DEFAULT: '#0B0F1A',
          card: '#1A1F2E',
        },
        accent: {
          success: '#22C55E',
          danger: '#EF4444',
          warning: '#F59E0B',
          info: '#0ea5e9',
        },
        content: {
          DEFAULT: '#F1F5F9',
          muted: '#64748B',
        }
      },
      fontFamily: {
        geist: ['Geist', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(11, 95, 255, 0.3)',
        'glass': '0 4px 30px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
      }
    },
  },
  plugins: [],
}
