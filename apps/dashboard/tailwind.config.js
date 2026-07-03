/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        kova: {
          navy: '#0F1F3D',
          blue: '#1A3FAA',
          blueMid: '#2D5BE3',
          green: '#00B27A',
          coral: '#FF3B30',
          surface: '#F8F9FB',
          border: '#E2E6ED',
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
