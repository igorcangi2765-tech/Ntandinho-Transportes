import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0f172a',
          'blue-light': '#1e293b',
          yellow: '#F29900',
          'yellow-hover': '#D98800',
          orange: '#F29900',
          'orange-hover': '#D98800',
          'orange-light': 'rgba(242, 153, 0, 0.12)',
        },
        navy: {
          950: '#020617',
          900: '#0f172a',
          850: '#151f38',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        },
        surface: {
          dark: '#020617',
          card: '#0f172a',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.04)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px -3px rgba(242, 153, 0, 0.35)',
        'orange-glow': '0 0 20px -3px rgba(242, 153, 0, 0.35)',
        'navy-glow': '0 0 25px -5px rgba(15, 23, 42, 0.6)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};

export default config;
