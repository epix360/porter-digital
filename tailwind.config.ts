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
        accent: {
          50: rgbVar('--accent-50'),
          500: rgbVar('--accent-500'),
          700: rgbVar('--accent-700'),
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
