/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tps: {
          paper: '#FCFAF5',
          canvas: '#e5e5e5',
          primary: '#3c2065',
          accent1: '#5e3898',
          accent2: '#a57ced',
          footer: '#1b1029',
          text: '#1f2937',
          quote: '#8b2c39', // Added based on the screenshot
        }
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['system-ui', 'sans-serif'],
      },
      maxWidth: {
        '5xl': '1024px',
      }
    },
  },
  plugins: [],
}
