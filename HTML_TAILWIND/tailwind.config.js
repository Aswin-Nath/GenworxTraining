/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode:"class",
  content: [
    "./*.html"
  ],
  theme: {
    extend: {
      screens:{
        "xs":"200px","sm":"400px","md":"700px","lg":"1000px"
      },
      colors:{
        "primary":"red","secondary":"yellow","ternary":"orange"
      }
    },
  },
  plugins: [],
}
