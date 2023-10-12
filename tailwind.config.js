/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'in': '#ec6471',
        'out': '#02977e'
      }
    },
  },
  plugins: [],
}

