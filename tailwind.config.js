/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          forest: '#166534',
          forestHover: '#115029',
          fresh: '#22C55E',
          pale: '#F0FDF4',
          canvas: '#F8FAF7',
          charcoal: '#17251C',
          muted: '#647067',
          border: '#E5EAE5',
          white: '#FFFFFF',
        },
        hl: {
          forest: '#166534',
          fresh: '#22C55E',
          pale: '#F0FDF4',
          bg: '#F8FAF7',
          charcoal: '#17251C',
          muted: '#647067',
          border: '#E5EAE5',
        },
      },
      fontFamily: {
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(23, 37, 28, 0.04)',
        elevated: '0 8px 24px -4px rgba(23, 37, 28, 0.06), 0 2px 6px -1px rgba(23, 37, 28, 0.03)',
        modal: '0 20px 40px -12px rgba(23, 37, 28, 0.14), 0 4px 12px -2px rgba(23, 37, 28, 0.06)',
      },
    },
  },
  plugins: [],
};
