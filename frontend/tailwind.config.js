/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#464655',
          100: '#0e0e11',
          200: '#1c1c22',
          300: '#292932',
          400: '#373743',
          500: '#464655',
          600: '#65657b',
          700: '#89899f',
          800: '#b0b0bf',
          900: '#d8d8df'
        },
        battleship_gray: {
          DEFAULT: '#94958b',
          100: '#1e1e1b',
          200: '#3b3c36',
          300: '#595a51',
          400: '#77786d',
          500: '#94958b',
          600: '#a9aaa1',
          700: '#bebfb8',
          800: '#d4d4d0',
          900: '#e9eae7'
        },
        french_gray: {
          DEFAULT: '#b7b6c1',
          100: '#232329',
          200: '#464552',
          300: '#6a687a',
          400: '#908f9f',
          500: '#b7b6c1',
          600: '#c6c6ce',
          700: '#d5d4da',
          800: '#e3e2e7',
          900: '#f1f1f3'
        },
        lavender_web: {
          DEFAULT: '#d5cfe1',
          100: '#282135',
          200: '#50436b',
          300: '#78659f',
          400: '#a79bc0',
          500: '#d5cfe1',
          600: '#ded9e7',
          700: '#e6e3ed',
          800: '#efecf3',
          900: '#f7f6f9'
        },
        pale_purple: {
          DEFAULT: '#eddfef',
          100: '#3a1f3e',
          200: '#743e7b',
          300: '#a965b1',
          400: '#cba3d1',
          500: '#eddfef',
          600: '#f1e7f3',
          700: '#f5edf6',
          800: '#f8f3f9',
          900: '#fcf9fc'
        }
      }
    }
  },
  plugins: [],
}
