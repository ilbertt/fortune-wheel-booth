/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'dfinity-gradient-dark':
          'linear-gradient(to right, #6a85f1, #8282f3, #997ef4, #b078f3, #c572ef)',
      },
    },
  },
  plugins: [],
};
