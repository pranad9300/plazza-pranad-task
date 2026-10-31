const jiti = require('jiti')(__filename);
const { colors, spacing, radius, fontSize } = jiti('./src/core/theme/tokens.ts');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors,
      spacing,
      borderRadius: radius,
      fontSize,
    },
  },
  plugins: [],
};
