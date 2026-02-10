/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          900: '#050507',
          800: '#0f1014',
          700: '#181920',
        },
        neon: {
          blue: '#00f2ff',
          purple: '#bd00ff',
          green: '#0aff00',
        }
      },
      boxShadow: {
        'neon-blue': '0 0 10px rgba(0, 242, 255, 0.5)',
        'neon-purple': '0 0 10px rgba(189, 0, 255, 0.5)',
      }
    },
  },
  plugins: [],
}