/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The "Obsidian" Palette - True Neutrals
        app: {
          950: '#09090b', // Main BG (Almost Black)
          900: '#18181b', // Card BG (Dark Zinc)
          800: '#27272a', // Lighter Card / Hover
          700: '#3f3f46', // Borders (Crisp Grey)
          500: '#71717a', // Muted Text
        },
        // Brand is now stark WHITE for maximum contrast/professionalism
        brand: {
          500: '#fafafa', // Primary Action (White)
          600: '#d4d4d8', // Hover (Light Grey)
          dark: '#27272a', // Secondary Action
        },
        status: {
          success: '#10b981', // Subtle Emerald
          warning: '#f59e0b', // Amber
          error: '#ef4444',   // Red
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'], // Tech feel for numbers
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
        'sharp': '0 0 0 1px rgba(255,255,255,0.05), 0 4px 6px -1px rgba(0,0,0,0.5)', // High-end border feel
      }
    },
  },
  plugins: [],
}