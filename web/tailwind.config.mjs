// web/tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        crimson: { DEFAULT: '#D7263D', 50: '#FDECEE', 500: '#D7263D', 600: '#A81B30', 700: '#831322' },
        cyan:    { DEFAULT: '#1FB6E0', 50: '#E6F7FC', 500: '#1FB6E0', 600: '#0E7DA1', 700: '#0A5E7A' },
        ink:     { DEFAULT: '#1F2933', strong: '#0F1A24', edge: '#3B4754', muted: '#6B7785' },
        surface: { DEFAULT: '#FFFFFF', soft: '#F7FAFC', crimson: '#FDECEE', cyan: '#E6F7FC' },
        hairline: '#E4E9EE',
      },
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        sans:    ['"Open Sans Variable"', '"Open Sans"', 'system-ui', 'sans-serif'],
        accent:  ['Lato', '"Open Sans"', 'system-ui', 'sans-serif'],
      },
      maxWidth: { content: '1200px' },
      boxShadow: {
        tile:      '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)',
        tileHover: '0 12px 32px rgba(215,38,61,0.12)',
        cta:       '0 4px 12px rgba(215,38,61,0.22)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
