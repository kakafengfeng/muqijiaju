/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        wood: {
          100: '#f0e6d2',
          500: '#8c7a6b',
          800: '#5c4d42',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      letterSpacing: {
        widest: '0.2em',
      },
    },
  },
  plugins: [],
}
