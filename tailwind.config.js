module.exports = {
  darkMode: 'class',
  extend: {
    animation: {
      'fade-in': 'fadeIn 0.5s ease-in',
      'fade-in-delay': 'fadeIn 0.5s ease-in 0.2s forwards',
      'fade-in-delay-2': 'fadeIn 0.5s ease-in 0.4s forwards',
      'fade-in-delay-3': 'fadeIn 0.5s ease-in 0.6s forwards',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0', transform: 'translateY(10px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
    },
  },
}
