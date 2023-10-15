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
    extend: {
			animation: {
				wiggle: 'wiggle 0.2s ease-in-out 2'
			},
			keyframes: {
				wiggle: {
					'0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
				}
			}
		},
  },
  plugins: [],
}

