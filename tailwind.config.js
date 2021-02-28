const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        128: '32rem',
      },
    },
    colors: {
      accent: 'var(--accent-color)', // exists
      lightAccent: 'var(--light-accent-color)',
      darkAccent: 'var(--dark-accent-color)',
      mainTxt: 'var(--main-txt-color)', // exists
      secondTxt: 'var(--second-txt-color)',
      accentTxt: 'var(--accent-txt-color)',
      mainBg: 'var(--main-bg-color)', // exists
      secondBg: 'var(--second-bg-color)',
      thirdBg: 'var(--third-bg-color)',
      lines: 'var(--line-color)',
      borderBg: 'var(--main-border-color)',
      neutral: 'var(--neutral-color)',
      //default colors
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.coolGray,
      red: colors.red,
      pink: colors.pink,
      teal: colors.teal,
      pink: colors.fuchsia,
      yellow: colors.amber,
      blue: colors.blue,
      indigo: colors.indigo,
      green: colors.emerald,
      purple: colors.violet,
    },
    extend: {
      borderRadius: {
        '4xl': '2rem',
      },
      fontSize: {
        'xxs': '0.5rem',
        'lsm': '0.933rem'
      },
    },
  },  
};
