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
        // 系统字体栈：不再从 Google 下载字体。中文优先苹方/微软雅黑，
        // 英文衬线用 Georgia 替代 Playfair Display。
        sans: [
          'system-ui',
          '-apple-system',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"Noto Sans SC"',
          'sans-serif',
        ],
        serif: ['Georgia', '"Times New Roman"', '"Songti SC"', '"SimSun"', 'serif'],
      },
      letterSpacing: {
        widest: '0.2em',
      },
    },
  },
  plugins: [],
}
