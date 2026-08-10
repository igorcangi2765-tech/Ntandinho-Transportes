import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // FASE 1 — Global Design System Tokens
        background: 'var(--background)',
        surface: {
          DEFAULT: 'var(--surface)',
          hover: 'var(--surface-hover)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          soft: 'var(--primary-soft)',
        },
        navy: {
          DEFAULT: 'var(--navy)',
          dark: 'var(--navy-dark)',
          700: '#1C2A48',
          800: '#16223B',
          900: '#111D33',
          950: '#0B132B',
        },
        blue: {
          DEFAULT: 'var(--blue)',
          support: 'var(--blue-support)',
        },
        border: 'var(--border)',
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        info: 'var(--info)',

        // Backwards compatibility mappings for existing utility usages
        brand: {
          primary: 'var(--primary)',
          'primary-hover': 'var(--primary-hover)',
          'primary-soft': 'var(--primary-soft)',
          navy: 'var(--navy)',
          'navy-dark': 'var(--navy-dark)',
          'navy-light': '#111D33',
          blue: 'var(--blue)',
          'blue-support': 'var(--blue-support)',
          orange: 'var(--primary)',
          'orange-hover': 'var(--primary-hover)',
          'orange-light': 'var(--primary-soft)',
          yellow: 'var(--primary)',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1C2A48',
          900: '#111D33',
          950: '#0B132B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        card: '0 4px 12px -2px rgba(0, 0, 0, 0.08)',
        glow: '0 0 20px -3px rgba(246, 168, 35, 0.3)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
