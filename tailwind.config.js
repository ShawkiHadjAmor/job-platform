// tailwind.config.js
module.exports = {
  purge: [
    './src/**/*.{html,ts}', // This path is correct for your project structure
    // If you have components outside src, add them here, e.g.:
    // './projects/**/*.{html,ts}'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#3A59D1',
        background: '#ECFAE5',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};