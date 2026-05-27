/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#003B73',
          dark: '#00254a',
        },
        secondary: {
          DEFAULT: '#F9A826',
        },
        dark: {
          DEFAULT: '#071426',
          card: '#0d1f36',
          bg: '#050e1a',
        },
      },
      fontFamily: {
        bengali: ['Hind Siliguri', 'Noto Sans Bengali', 'sans-serif'],
        english: ['Inter', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
