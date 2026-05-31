/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{svelte,ts,js}'],
  theme: {
    extend: {
      fontFamily: {
        jp: ['"Noto Sans JP"', 'system-ui', 'sans-serif']
      },
      colors: {
        ink: '#0f172a',
        sakura: '#f472b6'
      }
    }
  },
  plugins: []
};
