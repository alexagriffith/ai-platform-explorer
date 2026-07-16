/** @type {import('tailwindcss').Config} */
// Semantic colors resolve to the app token layer in src/index.css, which maps to
// the vendored PatternFly tokens (src/styles/patternfly-tokens.css). Using
// rgb(var(--x) / <alpha-value>) keeps Tailwind opacity modifiers working, and the
// tokens swap under prefers-color-scheme so most dark: variants are unnecessary.
const token = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: token('--app-page'),
        surface: token('--app-surface'),
        tint: token('--app-tint'),
        ink: token('--app-ink'),
        muted: token('--app-muted'),
        faint: token('--app-faint'),
        hair: token('--app-hair'),
        edge: token('--app-border'),
        accent: {
          DEFAULT: token('--app-accent'),
          strong: token('--app-accent-strong'),
        },
        link: token('--app-link'),
        'draft-bg': token('--app-draft-bg'),
        'draft-fg': token('--app-draft-fg'),
        'on-accent': token('--app-on-accent'),
      },
      fontFamily: {
        // Red Hat Text / Display with system fallbacks (fonts are not vendored).
        sans: ['"Red Hat Text"', 'RedHatText', 'system-ui', '-apple-system', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['"Red Hat Display"', 'RedHatDisplay', 'system-ui', '-apple-system', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        // One surface radius token; circular marks use Tailwind's built-in rounded-full.
        card: '6px', // pf border-radius-200
      },
      fontSize: {
        // PatternFly type steps (kept alongside Tailwind defaults for the restyle).
        'pf-100': '0.75rem',
        'pf-200': '0.875rem',
        'pf-300': '1rem',
        'pf-400': '1.125rem',
        'pf-500': '1.25rem',
        'pf-600': '1.5rem',
        'pf-700': '1.75rem',
        'pf-800': '2.25rem',
      },
    },
  },
  plugins: [],
}
