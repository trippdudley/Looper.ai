/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Looper dark mode tokens
        bg: '#0C1117',
        surface: '#151D28',
        'surface-alt': '#1E2A36',
        accent: '#10B981',
        border: '#2A3A4A',
        'border-strong': '#3A4856',
        // Text
        'text-primary': '#E8ECF1',
        'text-secondary': '#8B99A8',
        'text-tertiary': '#5E6E7E',
        // Semantic
        confidence: '#0FA87A',
        caution: '#D4980B',
        flag: '#C93B3B',
      },
      fontFamily: {
        sans: ['DM Sans', 'System'],
        mono: ['SpaceMono', 'Courier'],
      },
    },
  },
  plugins: [],
};
