/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        // GitHub Dark Theme
        'gh-canvas': '#0d1117',
        'gh-canvas-subtle': '#161b22',
        'gh-canvas-inset': '#010409',
        'gh-border': '#21262d',
        'gh-border-muted': '#30363d',
        'gh-text': '#c9d1d9',
        'gh-text-muted': '#8b949e',
        'gh-text-subtle': '#484f58',
        'gh-accent': '#58a6ff',
        'gh-success': '#238636',
        'gh-success-emphasis': '#2ea043',
        'gh-danger': '#da3633',
        'gh-warning': '#9e6a03',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Noto Sans', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
