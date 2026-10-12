/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22a447', // Primary green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534', // Deep forest green
          900: '#14532d',
          950: '#052e16',
        },
        poshan: {
          50: '#F0FDF4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22A447', // Primary green
          600: '#1da040',
          700: '#166534', // Deep forest green
          800: '#14532d',
          900: '#0f3d20',
          950: '#052e16',
        },
        saffron: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#F59E0B', // Warm saffron accent
          600: '#d97706',
          700: '#b45309',
        },
        mint: {
          50: '#F0FDF4',
          100: '#dcfce7',
        },
        charcoal: {
          primary: '#17231B',
          secondary: '#647067',
          border: '#E2E8E3',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
