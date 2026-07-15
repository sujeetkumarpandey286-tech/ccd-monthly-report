import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#4f46e5', light: '#eef2ff', mid: '#a5b4fc' },
        teal: { DEFAULT: '#0d9488', light: '#ccfbf1' },
        amber: { DEFAULT: '#d97706', light: '#fef3c7' },
        rose: { DEFAULT: '#e11d48', light: '#ffe4e6' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      borderRadius: { xl: '12px', '2xl': '16px' },
      boxShadow: {
        glass: '0 4px 16px rgba(15,23,42,0.06)',
        glow: '0 0 40px rgba(79,70,229,0.08)',
      },
    },
  },
  plugins: [],
}
export default config
