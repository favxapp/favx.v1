import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--favx-color-canvas)',
        soft: 'var(--favx-color-canvas-soft)',
        surface: 'var(--favx-color-surface)',
        subtle: 'var(--favx-color-surface-subtle)',
        ink: { strong: 'var(--favx-color-ink-strong)', DEFAULT: 'var(--favx-color-ink-default)', muted: 'var(--favx-color-ink-muted)' },
        line: 'var(--favx-color-border-default)',
        field: 'var(--favx-field-border)',
        brand: { DEFAULT: 'var(--favx-color-action-primary)', hover: 'var(--favx-color-action-primary-hover)', text: 'var(--favx-color-action-primary-text)' },
        danger: { text: 'var(--favx-color-danger-text)', bg: 'var(--favx-color-danger-bg)', border: 'var(--favx-color-danger-border)' },
        success: { text: 'var(--favx-color-success-text)', bg: 'var(--favx-color-success-bg)', border: 'var(--favx-color-success-border)' },
        link: 'var(--favx-color-link)',
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'Arial', 'sans-serif'],
        serif: ['var(--font-manrope)', 'Arial', 'sans-serif'],
      },
      borderRadius: { md: 'var(--favx-radius-md)', lg: 'var(--favx-radius-lg)', xl: 'var(--favx-radius-xl)' },
      boxShadow: { card: 'var(--favx-shadow-card)' },
      maxWidth: { form: 'var(--favx-container-form)', content: 'var(--favx-container-content)' },
    },
  },
  plugins: [],
};

export default config;
