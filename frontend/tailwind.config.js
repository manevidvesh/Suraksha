/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F7F5F1",
        paperDim: "#EFECE4",
        ink: "#1C2420",
        inkSoft: "#565F58",
        line: "#D9D4C7",
        slate: "#22364A",
        slateSoft: "#3E5E82",
        immediate: "#B5462F",
        shortTerm: "#C0872B",
        mediumTerm: "#3E5E82",
        pine: "#3D6B5C",
        pineSoft: "#E4ECE7",
      },
    },
  },
  plugins: [],
}
