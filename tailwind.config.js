const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'class',
  content: ['content/**/*.{md,yml,json,json5,csv}'],
  theme: {
    extend: {
      colors: {
        // Customize the feeling of your site
        gray: colors.stone
      }
    }
  }
}
