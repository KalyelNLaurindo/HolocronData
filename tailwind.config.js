/** @type {import('tailwindcss').Config} */
export default {
  // Scan all HTML and JS files for used classes (tree-shaking)
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Outfit"', '"Google Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: '#0f172a',
        'surface-glass': 'rgba(30, 41, 59, 0.45)',
        'surface-glass-hover': 'rgba(30, 41, 59, 0.65)',
        'border-glass': 'rgba(255, 255, 255, 0.1)',
        primary: '#38bdf8',
        secondary: '#f43f5e',
        tertiary: '#c084fc',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
