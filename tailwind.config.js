module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        slider: "slider 4s linear forwards",
      },
      keyframes: {
        slider: {
          "0%": { width: "0%" },
          "4.1%": { width: "4.1%" },
        },
      },
    },
  },
  plugins: [],
};
