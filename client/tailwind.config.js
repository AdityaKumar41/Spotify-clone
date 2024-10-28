const { nextui } = require("@nextui-org/theme");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/(button|ripple|spinner).js",
  ],
  theme: {
    extend: {
      colors: {
        "spotify-green": "#4CAF50",
        "dark-bg": "#121212",
      },
    },
  },
  plugins: [nextui()],
};
