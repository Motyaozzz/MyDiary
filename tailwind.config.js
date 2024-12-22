/** @type {import('tailwindcss').Config} */
module.exports = {
   // NOTE: Update this to include the paths to all of your component files.
   content: ["./app/**/*.{js,jsx,ts,tsx}"],
   presets: [require("nativewind/preset")],
   theme: {
      extend: {
        colors: {
          primary: "#161622",
          secondary: {
            DEFAULT: "#FF9C01",
            100: "#FF9001",
            200: "#FF8E01",
          },
          black: {
            DEFAULT: "#000",
            100: "#1E1E2D",
            200: "#232533",
          },
          gray: {
            100: "#CDCDE0",
          },
        },
        fontFamily: {
          pregular: ["Playfair-Regular", "sans-serif"],
          pmedium: ["Playfair-Medium", "sans-serif"],
          psemibold: ["Playfair-SemiBold", "sans-serif"],
          pbold: ["Playfair-Bold", "sans-serif"],
          pextrabold: ["Playfair-ExtraBold", "sans-serif"],
          pblack: ["Playfair-Black", "sans-serif"],
        },
      },
    },
   plugins: [],
 }