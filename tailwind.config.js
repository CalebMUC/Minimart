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
  },
  plugins: [
  ],
}