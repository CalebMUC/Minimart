module.exports = {
  important: true, // Add this to make Tailwind classes !important

  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        faintblue: "#66b2ff",
        actions : "#ecb22e",
        actionsHover : "#ecb22e"
      },
      
    },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        'slide-in': 'slide-in 0.5s ease-out',
        'bounce': 'bounce 1s infinite',
      }
  },
  plugins: [
  ],
}