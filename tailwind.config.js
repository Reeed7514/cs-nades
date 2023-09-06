/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      // simplified chinese
      'noto': ['Noto Sans SC', 'sans-serif'],
      // map names
      'kanit': ['Kanit', 'sans-serif'],
      // site icon font
      'blackops': ['Black Ops One', 'sans-serif']
    },
    extend: {},
  },
  plugins: [],
}

