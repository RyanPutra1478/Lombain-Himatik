/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        himatik: {
          navy: '#141e46',
          gold: '#ffb000',
          blue: '#1e3a8a',
        },
        primary: {
          DEFAULT: '#141e46',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#ffb000',
          foreground: '#141e46',
        }
      },
    },
  },
  plugins: [],
}
