/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        primary: '#4F46E5', // Indigo
        secondary: '#06B6D4', // Cyan
        accent: '#F59E0B' // Amber
      }
    }
  },
  plugins: []
}
