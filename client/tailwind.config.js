/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        wtsGreen: "#00A884",
        dark2: "#141414",
        dark1: "#111111",
        lightGrey: "#202020",
      },
    },
  },
  plugins: [require("daisyui")],
};
