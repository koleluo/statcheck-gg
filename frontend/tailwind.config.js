/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          500: '#5383e8',
          600: '#3d6fe0',
          700: '#2855c4',
          900: '#1a3a8a',
        },
        surface: {
          primary: '#1a1b2e',
          secondary: '#16213e',
          card: '#0f3460',
          hover: '#1a2a50',
          border: '#2a3f6f',
        },
        win: '#1a9c3e',
        loss: '#c23b22',
        'win-bg': '#1a2e1e',
        'loss-bg': '#2e1a1a',
        gold: '#c89b3c',
        platinum: '#4db8bf',
        diamond: '#576bce',
        master: '#9d48e0',
        grandmaster: '#e84057',
        challenger: '#f4c874',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
};
