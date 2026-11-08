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
        brand: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        dark: {
          bg: '#0A0B12',
          surface: '#111320',
          elevated: '#17192C',
          card: '#131524',
          border: 'rgba(255, 255, 255, 0.08)',
          subtle: 'rgba(255, 255, 255, 0.04)',
        },
        light: {
          bg: '#F5F4FA',
          surface: '#FFFFFF',
          elevated: '#FFFFFF',
          card: '#FFFFFF',
          border: '#E8E5F3',
          subtle: '#FAF9FD',
        }
      },
      boxShadow: {
        'glow-violet': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
        'glow-sm': '0 0 15px -3px rgba(124, 58, 237, 0.25)',
        'card-light': '0 10px 30px -10px rgba(124, 58, 237, 0.06), 0 4px 12px -4px rgba(15, 23, 42, 0.03)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
