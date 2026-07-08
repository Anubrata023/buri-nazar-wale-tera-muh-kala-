/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'jan-navy': '#1A1F2C',
        'jan-coral': '#FF4D5A',
        'jan-canvas': '#F4F6FA',
        'jan-slate': '#0D1424'
      }
    },
  },
  plugins: [],
}