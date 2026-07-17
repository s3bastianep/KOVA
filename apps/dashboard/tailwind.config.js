/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        kova: {
          ink: '#12140F',
          paper: '#EDEFEA',
          paper2: '#F6F7F2',
          indigo: '#3341C4',
          indigoDark: '#212C93',
          lime: '#c5de4e',
          limeDark: '#5C6E12',
          slate: '#6B6F64',
          line: '#D7D9CE',
          rose: '#E85C6B',
          navy: '#12140F',
          blue: '#3341C4',
          blueMid: '#212C93',
          green: '#5C6E12',
          coral: '#E85C6B',
          surface: '#EDEFEA',
          border: '#D7D9CE',
        },
        slate: {
          400: '#A7ABA0',
          500: '#6B6F64',
          600: '#565A50',
          800: '#12140F',
          900: '#12140F',
        },
      },
      fontFamily: {
        heading: ['var(--font-sora)', 'Sora', 'Inter', 'sans-serif'],
        body: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
