import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const rgbVar = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx,mdx}',
    './src/components/**/*.{ts,tsx,mdx}',
    './src/sanity/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: rgbVar('--brand-50'),
          100: rgbVar('--brand-100'),
          200: rgbVar('--brand-200'),
          300: rgbVar('--brand-300'),
          400: rgbVar('--brand-400'),
          500: rgbVar('--brand-500'),
          600: rgbVar('--brand-600'),
          700: rgbVar('--brand-700'),
          800: rgbVar('--brand-800'),
          900: rgbVar('--brand-900'),
          950: rgbVar('--brand-950'),
        },
        secondary: {
          50: rgbVar('--secondary-50'),
          100: rgbVar('--secondary-100'),
          200: rgbVar('--secondary-200'),
          300: rgbVar('--secondary-300'),
          400: rgbVar('--secondary-400'),
          500: rgbVar('--secondary-500'),
          600: rgbVar('--secondary-600'),
          700: rgbVar('--secondary-700'),
          800: rgbVar('--secondary-800'),
          900: rgbVar('--secondary-900'),
        },
        accent: {
          50: rgbVar('--accent-50'),
          100: rgbVar('--accent-100'),
          200: rgbVar('--accent-200'),
          300: rgbVar('--accent-300'),
          400: rgbVar('--accent-400'),
          500: rgbVar('--accent-500'),
          600: rgbVar('--accent-600'),
          700: rgbVar('--accent-700'),
          800: rgbVar('--accent-800'),
          900: rgbVar('--accent-900'),
        },
        surface: {
          DEFAULT: rgbVar('--surface'),
          muted: rgbVar('--surface-muted'),
          inverse: rgbVar('--surface-inverse'),
        },
        text: {
          DEFAULT: rgbVar('--text'),
          muted: rgbVar('--text-muted'),
          inverse: rgbVar('--text-inverse'),
        },
        border: rgbVar('--border'),
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          md: '2rem',
          lg: '4rem',
        },
        screens: {
          '2xl': '1280px',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
