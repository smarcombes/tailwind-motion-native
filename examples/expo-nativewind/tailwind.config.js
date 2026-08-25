/** @type {import('tailwindcss').Config} */
module.exports = {
  // `motion-*` classes are resolved at runtime by tailwind-motion-native, but
  // every other class still has to be in Tailwind's content globs.
  content: ['./app/**/*.{js,ts,tsx}', './examples/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // The Nativewind side of the comparison screen: the best a CSS animation
      // can do, with the bounce drawn by hand and the timing baked in.
      keyframes: {
        'pop-bezier': {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '55%': { opacity: '1', transform: 'scale(1.16)' },
          '75%': { transform: 'scale(0.97)' },
          '90%': { transform: 'scale(1.01)' },
          '100%': { transform: 'scale(1)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(25%)' },
          '100%': { opacity: '1', transform: 'translateX(0%)' },
        },
      },
      animation: {
        'pop-bezier': 'pop-bezier 700ms cubic-bezier(0.34, 1.4, 0.64, 1) both',
        'slide-in': 'slide-in 700ms cubic-bezier(0.165, 0.84, 0.44, 1) both',
      },
    },
  },
  plugins: [],
};
