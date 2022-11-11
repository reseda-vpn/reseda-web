module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./public/components/*.{js,ts,jsx,tsx}",
      "./public/components/**/*.{js,ts,jsx,tsx}",
      ".public/**/*.{js,ts,tsx,jsx}",
      "./public/components/un-ui/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        fontFamily: {
            sans: ["Public Sans", "Inter", "DM Sans", "Roboto", "sans-serif"],
            serif: ["DM Serif", "serif"],
            altSans: ["GT Walsheim Pro"],
            inter: ["Inter"]
        },
        extend: {},
    },
    plugins: [],
  }