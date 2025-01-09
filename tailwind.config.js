/** @type {import('tailwindcss').Config} */
module.exports = {
   // NOTE: Update this to include the paths to all of your component files.
   content: [
      "./app/*.{js,jsx,ts,tsx}",
      "./app/**/*.{js,jsx,ts,tsx}",
      "./components/*.{js,jsx,ts,tsx}",
   ],
   presets: [require("nativewind/preset")],
   theme: {
      extend: {
      colors: {
         primary: {
            DEFAULT: "#161622",
            hover: "#1d1d29",
         },
         accent: {
            DEFAULT: "#FF9C01",
            hover: "#FF9001",
         },
         secondary: {
            DEFAULT: "#FCFCFD",
            hover: "F2F2F3",
         },
         gray: {
            DEFAULT: "#CDCDE0",
         },
         link: "#1e40af"
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