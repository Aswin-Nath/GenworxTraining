/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./*.html", "./src/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#F59E0B",
        accent: "#10B981",
      },
      screens: {
        xs: "400px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  plugins: [],
};
