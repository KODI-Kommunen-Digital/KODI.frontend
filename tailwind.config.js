/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      scale: {
        '102':'1.02'
      },
      margin: {
        '5rem':'1rem'
      }
    },
  },
  plugins: [],
}
