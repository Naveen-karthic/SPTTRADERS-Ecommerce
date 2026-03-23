/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f172a',
          light: '#1e293b',
        },
        accent: {
          DEFAULT: '#3b82f6',
          light: '#60a5fa',
        },
        background: '#f8fafc',
        surface: '#ffffff',
        text: {
          main: '#0f172a',
          muted: '#64748b',
        }
      }
    },
  },
  plugins: [],
}
