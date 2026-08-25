/** @type {import('tailwindcss').Config} */
module.exports = {
  // `motion-*` classes are resolved at runtime by tailwind-motion-native, but
  // every other class still has to be in Tailwind's content globs.
  content: ['./app/**/*.{js,ts,tsx}', './examples/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
