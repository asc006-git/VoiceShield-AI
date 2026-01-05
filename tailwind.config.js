/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617', // Slate 950 (Very dark blue)
        surface: '#0f172a',    // Slate 900
        primary: '#3b82f6',    // Blue 500
        secondary: '#64748b',  // Slate 500
        accent: '#06b6d4',     // Cyan 500 (Neon glow)
        danger: '#ef4444',     // Red 500
        success: '#10b981',    // Emerald 500
        warning: '#f59e0b',    // Amber 500
        'scam-red': '#ff0000', // Specialized high-alert red
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #06b6d4, 0 0 10px #06b6d4' },
          '100%': { boxShadow: '0 0 20px #06b6d4, 0 0 25px #06b6d4' },
        }
      }
    },
  },
  plugins: [],
}
